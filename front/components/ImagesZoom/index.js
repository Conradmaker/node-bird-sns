import React, { useState } from "react";
import Slick from "react-slick";
import styled from "styled-components";
import {
  Overlay,
  Header,
  CloseBtn,
  SlickWrapper,
  ImgWrapper,
  Indicator,
  Global,
} from "./styles";

export default function index({ images, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <Overlay>
      <Global />
      <Header>
        <h1>상세이미지</h1>
        <CloseBtn onClick={onClose}>X</CloseBtn>
      </Header>
      <SlickWrapper>
        <div>
          <Slick
            initialSlide={0} //0번째부터 하겠다.
            afterChange={(slide) => setCurrentSlide(slide)}
            infinite //반복
            slidesToShow={1}
            slidesToScroll={1}
          >
            {/* 안에 있는 이미지들 구현 */}
            {images.map((v) => (
              <ImgWrapper key={v.src}>
                <img src={v.src} alt={v.src} />
              </ImgWrapper>
            ))}
          </Slick>
          <Indicator>
            <div>
              {currentSlide + 1} /{images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
}
