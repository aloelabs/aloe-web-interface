import styled from 'styled-components';
import tw from 'twin.macro';

export const FilterBadge = styled.div`
  ${tw`flex flex-row items-start`}
  background: rgba(255, 255, 255, 0.04);
  border-radius: 100px;
  padding: 8px 16px;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  font-weight: 400;
  line-height: 19px;
  height: 35px;
`;
