import { BsInbox } from "react-icons/bs";

interface Props {
  text?: string;
}

export default function NotFound({ text = "No data found" }: Props) {
  return (
    <div className="text-center p-2">
      <BsInbox size={60} className="text-secondary fw-bold" />
      <h5 className="text-secondary">{text}</h5>
      <p className="text-muted mb-0">There is currently no data to display.</p>
    </div>
  );
}
