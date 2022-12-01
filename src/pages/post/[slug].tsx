import { PrismicRichText } from '@prismicio/react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import * as prismich from '@prismicio/helpers';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: any;
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Carregando...</div>;
  }
  // console.log(post);
  const date = format(new Date(post.first_publication_date), 'dd MMM yyyy', {
    locale: ptBR,
  });
  const timeToRead = post.data.content.reduce((acc, content) => {
    const textLength = prismich.asText(content.body).split(' ').length;
    return Math.ceil(acc + textLength / 200);
  }, 0);
  return (
    <div>
      <div className={styles.imgContainer}>
        <img src={post.data.banner.url} alt="banner" />
      </div>
      <div className={commonStyles.contentContainer}>
        <header className={styles.header}>
          <h1>{post.data.title}</h1>
          <div>
            <div>
              <FiCalendar />
              <p>{date}</p>
            </div>
            <div>
              <FiUser />
              <p>{post.data.author}</p>
            </div>
            <div>
              <FiClock />
              <p>{timeToRead} min</p>
            </div>
          </div>
        </header>
        <div className={styles.content}>
          {post.data.content.map(content => (
            <div key={content.heading}>
              <h2>{content.heading}</h2>
              <div className={styles.text}>
                <PrismicRichText field={content.body} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getAllByType('posts');
  const paths = posts.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  // if (!params.slug) {
  //   return {
  //     redirect: {
  //       destination: '/',
  //       permanent: false,
  //     },
  //   };
  // }
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', params.slug, {});
  return {
    props: {
      post: response,
    },
  };
};
