import React from "react";
import Link from "next/link";

export default function PostCardContent({ postData }) {
  return (
    <div>
      {/* //정규표현식 */}
      {postData.split(/(#[^\s#]+)/g).map((v, i) => {
        if (v.match(/(#[^\s#]+)/g)) {
          return (
            <Link href={`/hashtag/${v.slice(1)}`} key={i}>
              {/* 인덱스로 키를 지정해줬다 바뀔일이 없어서 */}
              <a>{v}</a>
            </Link>
          );
        }
        return v;
      })}
    </div>
  );
}
