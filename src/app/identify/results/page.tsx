import { redirect } from "next/navigation";

export default function LegacyIdentifyResultsRedirect() {
  redirect("/library");
}
