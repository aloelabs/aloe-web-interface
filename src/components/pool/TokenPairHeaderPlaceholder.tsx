import styled from "styled-components";
import tw from "twin.macro";

export const TokenPairHeaderPlaceholder = styled.div`
  ${tw`flex items-center gap-4`}
  width: 360px;
  height: 60px;
  border-radius: 8px;
  background: #0d171e;
  background-image: linear-gradient(
    to right,
    #0d171e 0%,
    #131f28 20%,
    #0d171e 40%,
    #0d171e 100%
  );
  background-repeat: no-repeat;
  background-size: 360px 60px;
  display: inline-block;
  animation: shimmer 1s forwards linear infinite;

  @keyframes shimmer {
    0% {
      background-position: -360px 0;
    }
    100% {
      background-position: 360px 0;
    }
  }
`;