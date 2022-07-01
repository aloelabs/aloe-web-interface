import styled from 'styled-components';
import tw from 'twin.macro';

export const BlendGraphPlaceholder = styled.div`
  ${tw`flex flex-col items-start justify-evenly`}
  width: calc(100% + 64px);
  height: 300px;
  background: #0d171e;
  background-image: linear-gradient(
    to right,
    #0d171e 0%,
    #131f28 20%,
    #0d171e 40%,
    #0d171e 100%
  );
  background-repeat: no-repeat;
  background-size: 900px 300px;
  display: inline-block;
  animation: blendGraphShimmer 1s forwards linear infinite;
  overflow: hidden;
  position: relative;
  left: -32px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;

  @keyframes blendGraphShimmer {
    0% {
      background-position: -900px 0;
    }
    100% {
      background-position: 900px 0;
    }
  }
`;
