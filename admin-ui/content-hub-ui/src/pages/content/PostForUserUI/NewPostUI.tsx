import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import React, { useEffect, useRef, useState } from "react";
import { postApi } from "../../../api/content/post.api";
import { mediaApi } from "../../../api/extentions/media.api";
import { DecodeToken } from "../../../api/extentions/decodeToken";
import TagList  from "../PostForUserUI/PostTagUI"
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
  cilSpeech,
  cilUnderline,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import "./style.css";

export default function NewPostPage() {
  //Auto save
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = React.useRef(false);
  const [AuthId, setAuthId] = useState<string | null>(null);
  const [postId, setPostId] = useState<string | null>(null);
  



  const [loadingMedia, setLoadingMedia] = useState(false);
  useEffect(() => {
    const user = DecodeToken.accessToken();
    setAuthId(user?.userId || null);
  }, []);

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
        console.log("🧹 cleanup debounce");
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

  // Editor setup
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        underline: false,
        link: false,
      }),
      Underline,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write something amazing..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",

    onUpdate: ({ editor }) => {
      const html = editor.getHTML();

      setForm((prev) => {
        const updated = { ...prev, content: html };

        triggerAutoSave(updated);

        return updated;
      });
    },
  });
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  useEffect(() => {
    if (!editor || isContentLoaded || !form.content) return;

    editor.commands.setContent(form.content);
    setIsContentLoaded(true);
  }, [editor, form.content, isContentLoaded]);

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

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      tags: e.target.value.split(",").map((t) => t.trim()),
    }));
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
        console.log("✅ Draft created");
      } else {
        await postApi.update(postId, payload);
        console.log("🔄 Auto updated");
      }

      lastSavedRef.current = current;
    } catch (err: any) {
      console.error("❌ Auto save error:", err?.response?.data || err);
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
    }, 2000);
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
        status: 0,
        isPaid: false,
        royaltyAmount: 0,
      };

      if (!postId) {
        // Lần submit đầu tiên tạo post
        const res = await postApi.create(payload);
        setPostId(res.data.id);
        console.log("✅ Post created");
      } else {
        // Update post hiện tại
        await postApi.update(postId, payload);
        console.log("🔄 Post updated");
      }

      alert("✅ Post saved successfully");
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

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h3 className="mb-4 fw-bold">✍️ Create New Post</h3>
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
                <TagList/>






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
                      style={{ pointerEvents: loadingMedia ? "none" : "auto" }}
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

                            editor
                              ?.chain()
                              .focus()
                              .setImage({ src: res.path })
                              .run();
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

            {/* META INFO */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Source</label>
                <input
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Source..."
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Tags</label>
                <input
                  onChange={handleTagsChange}
                  className="form-control"
                  placeholder="react, c#, api..."
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Category</label>
                <input
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="CategoryId"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Author</label>
                <input
                  name="authorUserId"
                  value={form.authorUserId}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="AuthorUserId"
                  required
                />
              </div>
            </div>

            {/* ACTION */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <small className="text-muted">Draft is auto-saving...</small>
              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={loading}
              >
                {loading ? "Publishing..." : "🚀 Publish"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
