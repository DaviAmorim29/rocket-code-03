import style from "./header.module.scss";
import commonStyles from "../../styles/common.module.scss";
import Link from "next/link";

export default function Header() {
  return (
    <div className={commonStyles.contentContainer} style={{padding: 0}}>
      <Link href="/">
        <div className={style.header}>
          <img src="/images/logo.svg" alt="logo" />
        </div>
      </Link>
    </div>
  )
}
