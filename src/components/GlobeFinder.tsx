import styled from 'styled-components';
import { Map } from './Map';
import { CountriesList } from './CountriesList';
import { useState } from 'react';

export const GlobeFinder = () => {
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [latlng, setLatLng] = useState<number[]>([]);

  return (
    <Wrapper>
      <CountriesList
        isMobileView={isMobileView}
        setLatLng={setLatLng}
        setIsMobileView={setIsMobileView}
      />
      <Map
        setIsMobileView={setIsMobileView}
        isMobileView={isMobileView}
        latlng={latlng}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #080808;
  overflow-y: hidden;

  ::-webkit-scrollbar {
    width: 0;
  }
`;
