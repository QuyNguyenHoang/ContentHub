import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import ResizeImage from "tiptap-extension-resize-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import React, { useEffect, useRef, useState } from "react";
import { postApi, type Series } from "../../../api/content/post.api";
import { mediaApi } from "../../../api/extentions/media.api";
import { DecodeToken } from "../../../api/extentions/decodeToken";
import TagList from "../PostForUserUI/PostTagUI";
import {
  cilAlignCenter,
  cilAlignLeft,
  cilAlignRight,
  cilBold,
  cilCode,
  cilImage,
  cilItalic,
  cilJustifyCenter,
  cilLink,
  cilList,
  cilListNumbered,
  cilSettings,
  cilSpeech,
  cilUnderline,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import "./style.css";
import { useNavigate } from "react-router-dom";

export default function NewPostPage() {
  //Auto save
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = React.useRef(false);
  const [AuthId, setAuthId] = useState<string | null>(null);
  const [postId, setPostId] = useState<string | null>(null);
  const [modalSetting, setModalSetting] = useState(false);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  useEffect(() => {
    const user = DecodeToken.accessToken();
    setAuthId(user?.userId || null);
  }, []);
  useEffect(() => {
    const fetchSeriesList = async () => {
      try {
        setLoading(true);

        // gọi API
        const res = await postApi.getSeriesDropdown();
        setSeriesList(res.data);
      } catch (error) {
        console.error("Failed to fetch series dropdown", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesList(); // gọi hàm async
  }, []);
  //  Load lần đầu (fix StrictMode)
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    content: "",
    source: "",
    tags: [] as string[],
    categoryId: "",
    status: 0,
    authorUserId: "",
  });
  useEffect(() => {
    if (AuthId) {
      setForm((prev) => ({
        ...prev,
        authorUserId: AuthId,
      }));
    }
  }, [AuthId]);
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        console.log("cleanup debounce");
      }
    };
  }, []);
  const postByUser = async (id: string) => {
    try {
      const res = await postApi.postByUser(id);
      const data = res.data;
      if (res) {
        setForm((prev) => ({
          ...prev,
          name: data.name || "",
          description: data.description || "",
          content: data.content || "",
          source: data.source || "",
          tags: data.tags ? data.tags.split(",") : [],
          categoryId: data.categoryId || "",
          status: data.status ?? 0,
        }));
        setPostId(data.id || null);
      }
      console.log("Full response:", res);
      console.log("Data:", res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    if (AuthId) {
      postByUser(AuthId);
    }
  }, [AuthId]);

  //Custom Image
  const CustomImage = Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        class: {
          default: "img-fluid rounded-2 border mx-auto d-block",
        },
      };
    },
  });
  // Editor setup
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        underline: false,
        link: false,
      }),
      Underline,
      CustomImage.configure({ inline: false }),
      ResizeImage,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write something amazing..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: form.content,

    onUpdate: ({ editor }) => {
      const html = editor.getHTML();

      setForm((prev) => {
        const updated = { ...prev, content: html };

        triggerAutoSave(updated);

        return updated;
      });
    },
  });

  useEffect(() => {
    if (!editor || !form.content) return;

    const currentHTML = editor.getHTML();
    if (currentHTML !== form.content) {
      editor.commands.setContent(form.content);
    }
  }, [editor, form.content]);

  const [, setToolbarUpdate] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const updateHandler = () => setToolbarUpdate((u) => u + 1);
    editor.on("update", updateHandler);
    editor.on("selectionUpdate", updateHandler);
    return () => {
      editor.off("update", updateHandler);
      editor.off("selectionUpdate", updateHandler);
    };
  }, [editor]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const lastSavedRef = useRef<string>("");
  const pendingRef = useRef<typeof form | null>(null);

  const saveDraft = async (data: typeof form) => {
    const current = JSON.stringify(data);

    // tránh gọi API trùng
    if (lastSavedRef.current === current) return;

    // nếu đang save → lưu pending
    if (savingRef.current) {
      pendingRef.current = data;
      return;
    }

    savingRef.current = true;

    try {
      const payload = {
        ...data,
        name: data.name.trim(),

        content: editor?.getHTML() || "",
        tags: data.tags.join(","),
        status: 0,
        isPaid: false,
        royaltyAmount: 0,
      };

      if (!postId) {
        const res = await postApi.create(payload);
        setPostId(res.data.id);
        console.log("Draft created");
      } else {
        await postApi.update(postId, payload);
        console.log(" Auto updated");
      }

      lastSavedRef.current = current;
    } catch (err: any) {
      console.error("Auto save error:", err?.response?.data || err);
      setErr(err?.response?.data?.message || "Auto save failed");
    } finally {
      savingRef.current = false;

      // 🔥 nếu có data mới → save tiếp
      if (pendingRef.current) {
        const next = pendingRef.current;
        pendingRef.current = null;
        saveDraft(next);
      }
    }
  };
  const triggerAutoSave = (data: typeof form) => {
    if (loading) return;
    if (!data.name?.trim()) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      saveDraft(data);
    }, 500);
  };

  // ==================
  // Submit form
  // ==================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!form.name?.trim() || !form.categoryId || !form.authorUserId) {
      setErr("Missing required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        name: form.name.trim(),

        content: editor?.getHTML() || "",
        tags: form.tags.join(","),
        status: 1,
        isPaid: false,
        royaltyAmount: 0,
      };

      if (!postId) {
        // Lần submit đầu tiên tạo post
        const res = await postApi.create(payload);
        setPostId(res.data.id);
        console.log("Post created");
      } else {
        // Update post hiện tại
        await postApi.update(postId, payload);
        console.log("Post updated");
      }

      alert("Post saved successfully");
      setPostId(null);
      setForm({
        name: "",
        description: "",
        content: "",
        source: "",
        tags: [],
        categoryId: "",
        status: 1,
        authorUserId: AuthId || "",
      });
      // reset editor
      editor?.commands.clearContent();
      navigate("/posts");
      // reset auto save cache
      lastSavedRef.current = "";
      pendingRef.current = null;
    } catch (err: any) {
      console.error("Submit failed:", err.response?.data || err);
      setErr(err.response?.data?.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  if (!editor) return null;

  const ToolbarButton = ({ onClick, active, icon, title, children }: any) => (
    <button
      type="button"
      onClick={onClick}
      className={`btn btn-light ${active ? "active" : ""}`}
      title={title}
    >
      {icon ? <CIcon icon={icon} size="lg" /> : children}
    </button>
  );
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  return (
    <div>
      <div className="container py-4" style={{ maxWidth: 900 }}>
        <div className="d-flex align-items-center mb-2">
          {/* 2 nút gần nút X */}
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => navigate("/new")}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => navigate("/postdetail")}
            >
              Review
            </button>
          </div>
          {/* Toast */}
          {showToast && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.3)",
                zIndex: 9998,
              }}
            />
          )}
          <div
            className={`toast align-items-top rounded-2 ${showToast ? "show" : ""}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
              minWidth: 250,
            }}
          >
            <div className="toast-header">
              <strong className="me-auto">You have unsaved changes</strong>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
            <div className="toast-body">Your post auto save Draft</div>

            <button
              type="button"
              className="btn btn-sm btn-danger m-2"
              onClick={() => {
                setShowToast(false);
                setTimeout(() => {
                  navigate("/posts");
                });
              }}
            >
              Yes, leave this page
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary m-2"
              onClick={() => {
                setShowToast(false);
              }}
            >
              No, keep editing
            </button>
          </div>
          {/* nút Close ở cuối */}
          <button
            type="button"
            className="btn-close ms-auto"
            aria-label="Close"
            onClick={() => {
              setShowToast(true);
            }}
          ></button>
        </div>
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h3 className="mb-4 fw-bold">Create Post</h3>
            {err && <div className="alert alert-danger">{err}</div>}

            <form onSubmit={handleSubmit}>
              {/* TITLE */}
              <div className="mb-4">
                <label className="form-labelsmall text-muted mb-2">Title</label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control form-control-lg border-0 shadow-sm"
                  maxLength={100}
                  placeholder="New post title here..."
                  required
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                />
              </div>

              {/* TagUI */}
              <TagList
                value={form.tags}
                onChange={(tags) =>
                  setForm((prev) => ({
                    ...prev,
                    tags,
                  }))
                }
              />

              {/* DESCRIPTION */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="form-control"
                  rows={3}
                  placeholder="Short description..."
                />
              </div>

              {/* EDITOR */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Content</label>
                <div className="border rounded-3 shadow-sm">
                  {/* Toolbar */}
                  <div className="border-bottom bg-white p-2 d-flex flex-wrap gap-2 sticky-top">
                    {/* Text style */}
                    <div className="btn-group btn-group-sm">
                      <ToolbarButton
                        onClick={() => {
                          editor.chain().focus().toggleBold().run();
                          setToolbarUpdate((u) => u + 1);
                        }}
                        active={editor.isActive("bold")}
                        icon={cilBold}
                        title="Bold (B)"
                      />
                      <ToolbarButton
                        onClick={() => {
                          editor.chain().focus().toggleItalic().run();
                          setToolbarUpdate((u) => u + 1);
                        }}
                        active={editor.isActive("italic")}
                        icon={cilItalic}
                        title="Italic (I)"
                      />
                      <ToolbarButton
                        onClick={() => {
                          editor.chain().focus().toggleUnderline().run();
                          setToolbarUpdate((u) => u + 1);
                        }}
                        active={editor.isActive("underline")}
                        icon={cilUnderline}
                        title="Underline (U)"
                      />
                    </div>

                    {/* Headings & Lists */}
                    <div className="btn-group btn-group-sm">
                      <ToolbarButton
                        onClick={() => {
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 1 })
                            .run();
                          setToolbarUpdate((u) => u + 1);
                        }}
                        active={editor.isActive("heading", { level: 1 })}
                        title="Heading 1"
                      >
                        H1
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() => {
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run();
                          setToolbarUpdate((u) => u + 1);
                        }}
                        active={editor.isActive("heading", { level: 2 })}
                        title="Heading 2"
                      >
                        H2
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() => {
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 3 })
                            .run();
                          setToolbarUpdate((u) => u + 1);
                        }}
                        active={editor.isActive("heading", { level: 3 })}
                        title="Heading 3"
                      >
                        H3
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() => {
                          editor.chain().focus().toggleBulletList().run();
                          setToolbarUpdate((u) => u + 1);
                        }}
                        active={editor.isActive("bulletList")}
                        icon={cilList}
                        title="Bullet List"
                      />
                      <ToolbarButton
                        onClick={() => {
                          editor.chain().focus().toggleOrderedList().run();
                          setToolbarUpdate((u) => u + 1);
                        }}
                        active={editor.isActive("orderedList")}
                        icon={cilListNumbered}
                        title="Numbered List"
                      />
                    </div>

                    {/* Code & Blockquote */}
                    <div className="btn-group btn-group-sm">
                      <ToolbarButton
                        onClick={() => {
                          editor.chain().focus().toggleCodeBlock().run();
                          setToolbarUpdate((u) => u + 1);
                        }}
                        active={editor.isActive("codeBlock")}
                        icon={cilCode}
                        title="Code Block"
                      />
                      <ToolbarButton
                        onClick={() => {
                          editor.chain().focus().toggleBlockquote().run();
                          setToolbarUpdate((u) => u + 1);
                        }}
                        active={editor.isActive("blockquote")}
                        icon={cilSpeech}
                        title="Blockquote"
                      />
                    </div>

                    {/* Links & Images */}
                    <div className="btn-group btn-group-sm">
                      <ToolbarButton
                        onClick={() => {
                          const url = prompt("Enter URL");
                          if (url)
                            editor.chain().focus().setLink({ href: url }).run();
                        }}
                        icon={cilLink}
                        title="Insert Link"
                      />

                      {/* Up image */}
                      <label
                        className={`btn btn-light mb-0 ${loadingMedia ? "disabled opacity-50" : ""}`}
                        title="Upload Image"
                        style={{
                          pointerEvents: loadingMedia ? "none" : "auto",
                        }}
                      >
                        {loadingMedia ? (
                          <span className="spinner-border spinner-border-sm text-success"></span>
                        ) : (
                          <CIcon icon={cilImage} size="lg" />
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          disabled={loadingMedia}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            try {
                              setLoadingMedia(true);

                              const res = await mediaApi.uploadMedia(file);

                              setTimeout(() => {
                                editor
                                  .chain()
                                  .focus()
                                  .setImage({ src: res.path })
                                  .run();
                              }, 0);
                              const html = editor.getHTML();
                              setForm((prev) => {
                                const updated = { ...prev, content: html };
                                triggerAutoSave(updated);
                                return updated;
                              });
                            } catch (error) {
                              console.error("Upload failed:", error);
                            } finally {
                              setLoadingMedia(false);
                              e.target.value = "";
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Text alignment */}
                    <div className="btn-group btn-group-sm ms-auto">
                      <ToolbarButton
                        onClick={() => {
                          editor.chain().focus().setTextAlign("left").run();
                          setToolbarUpdate((u) => u + 1);
                        }}
                        active={editor.isActive({ textAlign: "left" })}
                        icon={cilAlignLeft}
                        title="Align Left"
                      />
                      <ToolbarButton
                        onClick={() => {
                          editor.chain().focus().setTextAlign("center").run();
                          setToolbarUpdate((u) => u + 1);
                        }}
                        active={editor.isActive({ textAlign: "center" })}
                        icon={cilAlignCenter}
                        title="Align Center"
                      />
                      <ToolbarButton
                        onClick={() => {
                          editor.chain().focus().setTextAlign("right").run();
                          setToolbarUpdate((u) => u + 1);
                        }}
                        active={editor.isActive({ textAlign: "right" })}
                        icon={cilAlignRight}
                        title="Align Right"
                      />
                      <ToolbarButton
                        onClick={() => {
                          editor.chain().focus().setTextAlign("justify").run();
                          setToolbarUpdate((u) => u + 1);
                        }}
                        active={editor.isActive({ textAlign: "justify" })}
                        icon={cilJustifyCenter}
                        title="Justify"
                      />
                    </div>
                  </div>

                  {/* Editor content */}
                  <div
                    className="p-4 bg-white"
                    style={{ minHeight: 300, cursor: "text" }}
                    onClick={() => editor.chain().focus().run()}
                  >
                    <EditorContent editor={editor} />
                  </div>
                </div>
              </div>

              {/* ACTION */}
              <div className="d-flex justify-content-between align-items-center mt-4">
                <small className="text-muted">Draft is auto-saving...</small>
                <div className="d-flex  justify-content-end">
                  <button
                    className="btn btn-light  rounded-circle  me-2 "
                    onClick={() => {
                      setModalSetting(true);
                    }}
                  >
                    <CIcon icon={cilSettings} width={24} height={24} />
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={loading}
                  >
                    {loading ? "Publishing..." : " Publish"}
                  </button>
                </div>
              </div>

              {/* Modal Setting */}
              {modalSetting && (
                <div
                  className="modal d-block fade show"
                  tabIndex={-1}
                  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                  <div
                    className="modal-dialog modal-dialog-centered modal-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Advanced Post Options</h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={() => setModalSetting(false)}
                        ></button>
                      </div>

                      <div className="modal-body">
                        {/* --- Nội dung UI thêm vào đây --- */}

                        {/* Canonical URL */}
                        <div className="mb-4">
                          <label
                            htmlFor="canonicalUrl"
                            className="form-label fw-bold"
                          >
                            Canonical URL
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="canonicalUrl"
                            placeholder="https://yoursite.com/post-title"
                          />
                          <small className="text-muted">
                            Change meta tag canonical_url if this post was first
                            published elsewhere (like your own blog).
                          </small>
                        </div>

                        {/* Schedule Publication */}
                        <div className="mb-4">
                          <label className="form-label fw-bold">
                            Schedule Publication
                          </label>
                          <div className="d-flex gap-2 mb-1">
                            <input type="date" className="form-control" />
                            <input type="time" className="form-control" />
                          </div>
                          <small className="text-muted">
                            Set a date and time to publish your post in the
                            future. Leave empty to publish immediately.
                          </small>
                          <div
                            className="text-muted mt-1"
                            style={{ fontSize: "0.85rem" }}
                          >
                            Using your local timezone: Asia/Saigon. Current
                            time: 1:22 PM on April 3, 2026.
                          </div>
                        </div>

                        {/* Series */}

                        <div className="mb-4">
                          <label
                            htmlFor="series"
                            className="form-label fw-bold"
                          >
                            Series
                          </label>

                          {/* Nếu chưa có series */}
                          {seriesList.length === 0 ? (
                            <p className="text-muted">No series yet</p>
                          ) : (
                            <div className="list-group mb-2">
                              {seriesList.map((s) => (
                                <label
                                  key={s.id}
                                  className="list-group-item list-group-item-action d-flex align-items-center"
                                >
                                  <input
                                    type="radio"
                                    name="series"
                                    value={s.id}
                                    onChange={() =>
                                      setForm((prev) => ({
                                        ...prev,
                                        seriesId: s.id,
                                      }))
                                    }
                                    className="form-check-input me-2"
                                  />
                                  {s.name}
                                </label>
                              ))}
                            </div>
                          )}

                          {/* Nút thêm series mới */}
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate("/new-series")} // hoặc mở modal thêm series
                          >
                            Add New Series
                          </button>

                          <small className="text-muted d-block mt-2">
                            Organize your posts into a series for better
                            discoverability.
                          </small>

                          <div
                            className="text-muted mt-1"
                            style={{ fontSize: "0.85rem" }}
                          >
                            Give your series a unique name. The series will be
                            visible once it has multiple posts.
                          </div>
                        </div>
                      </div>

                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                          onClick={() => setModalSetting(false)}
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => alert("This function will be soon")}
                        >
                          Save changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
