import React from 'react';
import styled from 'styled-components';

const Card: React.FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => <StyledCard>{children}</StyledCard>;

const StyledCard = styled.div`
background-color: rgb(255, 255, 255); //${(props) => props.theme.color.grey[800]};
backdrop-filter: blur(10px) !important;
-webkit-box-shadow: 10px 22px 33px 0px rgba(0, 0, 0, 0.9) !important;
-moz-box-shadow: 5px 22px 33px 0px rgba(0, 0, 0, 0.9) !important;
box-shadow: 10px 22px 33px 0px rgba(0, 0, 0, 0.9) !important;
overflow: hidden !important;
border-radius: 15px;
color: #000 !important;
display: flex;
flex: 1;
flex-direction: column;
`;

export default Card;

