/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Header from '../components/Header';
import { PostItem } from '../components/Post';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

export interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(props: HomeProps) {
  const [postsPagination, setPostsPagination] = useState(props.postsPagination);
  const handleNextPage = async () => {
    const response = await fetch(postsPagination.next_page);
    const data = await response.json();
    // const posts = data.results.map(post => {
    //   return {
    //     uid: post.uid,
    //     first_publication_date: format(
    //       new Date(post.first_publication_date),
    //       'dd MMM yyyy',
    //       {
    //         locale: ptBR,
    //       }
    //     ),
    //     data: {
    //       title: post.data.title,
    //       subtitle: post.data.subtitle,
    //       author: post.data.author,
    //     },
    //   };
    // });
    setPostsPagination({
      next_page: data.next_page,
      results: [...postsPagination.results, ...data.results],
    });
  };
  return (
    <div className={commonStyles.contentContainer}>
      <div className={styles.postList}>
        {postsPagination &&
          postsPagination.results.map(post => {
            const formattedDate = format(
              new Date(post.first_publication_date),
              'dd MMM yyyy',
              {
                locale: ptBR,
              }
            );
            return (
              <div key={post.uid} className={styles.post}>
                <Link href={`/post/${post.uid}`}>{post.data.title}</Link>
                <h3>{post.data.subtitle}</h3>
                <div className={styles.flexBoxTexts}>
                  <div>
                    <FiCalendar />
                    <span>{formattedDate}</span>
                  </div>
                  <div>
                    <FiUser />
                    <span>{post.data.author}</span>
                  </div>
                </div>
              </div>
            );
          })}
        {postsPagination.next_page && (
          <h3 onClick={handleNextPage}>Carregar mais posts</h3>
        )}
      </div>
    </div>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {});
  // const posts = postsResponse.results.map(post => {
  //   return {
  //     uid: post.uid,

  //     data: {
  //       title: post.data.title,
  //       subtitle: post.data.subtitle,
  //       author: post.data.author,
  //     },
  //   };
  // });
  // console.log(postsResponse)z
  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: postsResponse.results,
      },
    },
  };
};
