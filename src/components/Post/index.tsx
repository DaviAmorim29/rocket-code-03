import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { Post } from '../../pages';
import style from './post.module.scss';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
interface Props {
  post: Post;
}
export function PostItem({post}: Props) {
  return (
    <div className={style.post}>
      <Link href={`/post/${post.uid}`}>{post.data.title}</Link>
      <h3>{post.data.subtitle}</h3>
      <div className={style.flexBoxTexts}>
        <div>
          <FiCalendar />
          {/* <span>{post.first_publication_date}</span> */}
          <span>15 Mar 2021</span>
        </div>
        <div>
          <FiUser />
          <span>{post.data.author}</span>
        </div>
      </div>
    </div>
  );
}
