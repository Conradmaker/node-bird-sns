import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

import ImageZoom from "./ImagesZoom";

export default function PostImages({ images }) {
  const [showImagesZoom, setShowImagesZoom] = useState(false);
  const onZoom = () => {
    setShowImagesZoom(true);
  };
  const onClose = () => {
    setShowImagesZoom(false);
  };
  if (images.length === 1) {
    return (
      <>
        <img
          role="presentation"
          style={{ width: "50%", display: "inline-block" }}
          src={images[0].src}
          alt={images[0].src}
          onClick={onZoom}
        />
        {showImagesZoom && <ImageZoom images={images} onClose={onClose} />}
      </>
    );
  }
  if (images.length === 2) {
    return (
      <>
        <img
          role="presentation"
          style={{ width: "50%", display: "inline-block" }}
          src={images[0].src}
          alt={images[0].src}
          onClick={onZoom}
        />
        {showImagesZoom && <ImageZoom images={images} onClose={onClose} />}
        <img
          role="presentation"
          style={{ width: "50%", display: "inline-block" }}
          src={images[1].src}
          alt={images[1].src}
          onClick={onZoom}
        />
        {showImagesZoom && <ImageZoom images={images} onClose={onClose} />}
      </>
    );
  }

  return (
    <div>
      <img
        role="presentation"
        width="50%"
        src={images[0].src}
        alt={images[0].src}
        onClick={onZoom}
      />
      <div
        role="presentation"
        style={{
          display: "inline-block ",
          width: "50%",
          textAlign: "center",
          verticalAlign: "middle",
        }}
        onClick={onZoom}
      >
        <PlusOutlined />
        <br />
        {images.length - 1}
        개의 사진 더보기
      </div>
      {showImagesZoom && <ImageZoom images={images} onClose={onClose} />}
    </div>
  );
}
