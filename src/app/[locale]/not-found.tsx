import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="page-404">
      <h1>404</h1>
      <p>{t("not_found")}</p>
      <a href="/">{t("back_to_home")}</a>
    </div>
  );
}
