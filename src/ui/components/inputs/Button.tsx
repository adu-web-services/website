import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { BackgroundColor, ForegroundColor } from "../../styles/Colors";
import { FontSizes, FontWeights } from "../../styles/typography";

interface Props {
  //children
  icon?: JSX.Element;
  value?: string;

  fontSize?: FontSizes;
  fontWeight?: FontWeights;

  //variant
  text?: boolean;
  contained?: boolean;
  outlined?: boolean;

  //link
  href?: string;

  //other
  full?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: () => void;
}
export default function Button(p: Props) {
  const navigate = useNavigate();
  return (
    <Frame
      {...p}
      style={p}
      onClick={() => {
        if (p.href) navigate(p.href);
        if (p.onClick) p.onClick();
      }}
    >
      {p.icon}
      {p.value}
    </Frame>
  );
}

const Frame = styled.button<Props>`
  width: ${(p) => (p.full ? "100%" : null)};
  a {
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
  }
  background-color: transparent;
  border: 1px solid transparent;

  ${(p) => (p.text ? Text : null)};
  ${(p) => (p.contained ? Contained : null)}
  ${(p) => (p.outlined ? Outlined : null)}

  transition: all 0.1s ease-in-out;

  &:active {
    opacity: 0.5;
  }
`;

//variant
const Text = css`
  background-color: ${BackgroundColor.Default};
  border-color: transparent;
  padding: 0;
`;
const Contained = css`
  background-color: ${BackgroundColor.Light};
  border-color: ${ForegroundColor.Default};
  padding: 10px 15px;

  &:hover {
    background-color: ${BackgroundColor.Highest};
  }
`;
const Outlined = css`
  background-color: inherit;
  border-color: ${ForegroundColor.Default};
  padding: 10px 15px;

  &:hover {
    background-color: ${BackgroundColor.Highest};
  }
`;
