import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CircularProgress from '@mui/material/CircularProgress';
import '../App.css';
import { convertToShorter } from '../utilitis/converter';

interface Currency {
  symbol: string;
}

interface Country {
  name: {
    common: string;
  };
  capital: string[];
  population: number;
  currencies: { [code: string]: Currency };
  flags: {
    png: string;
  };
  capitalInfo: {
    latlng: number[];
  };
}

export const CountriesList = ({
  isMobileView,
  setLatLng,
  setIsMobileView,
}: {
  isMobileView: boolean;
  setLatLng: (latLng: number[]) => void;
  setIsMobileView: (isMobileView: boolean) => void;
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const respone = await fetch('https://restcountries.com/v3.1/all');
        const data = await respone.json();

        setCountries(data);
        setFilteredCountries(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchClick = () => {
    const filteredResults = filterCountries(countries, searchQuery);
    setFilteredCountries(filteredResults);
  };

  const filterCountries = (data: Country[], query: string) => {
    return data?.filter(
      (country) =>
        country.name.common.toLowerCase().includes(query.toLowerCase()) ||
        (country.capital?.length > 0 &&
          country.capital[0].toLowerCase().includes(query.toLowerCase()))
    );
  };

  const handleSetLatLng = (latlng: number[]) => {
    setLatLng(latlng);
    setIsMobileView(false);
  };

  const sortedFilteredCountry = filteredCountries.sort((a, b) => {
    if (a.name.common < b.name.common) {
      return -1;
    }
    if (a.name.common > b.name.common) {
      return 1;
    }
    return 0;
  });

  return (
    <Wrapper isMobileView={isMobileView}>
      {loading ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : (
        <div className="table-container">
          <div className="table-search">
            <input
              className="table-input"
              placeholder="Search country/capital"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearchClick}>Search</button>
          </div>
          <div className="headers">
            <span>Country</span>
            <span>Capital</span>
            <span>Flag</span>
            <span>Currency</span>
            <span>Population</span>
          </div>
          {sortedFilteredCountry.map((country, index) => (
            <>
              <div
                className="table-element"
                key={index}
                onClick={() => handleSetLatLng(country?.capitalInfo?.latlng)}
              >
                <div>{country.name.common}</div>
                <div className="capital">
                  {country.capital && country.capital.length > 0
                    ? country.capital[0]
                    : '-'}
                </div>
                <div>
                  <img src={country.flags.png} alt={`${country.name} flag`} />
                </div>
                <div className="currencie">
                  {country.currencies &&
                    Object.entries(country.currencies)[0][1].symbol}
                </div>
                <div>{convertToShorter(country.population)}</div>
              </div>
              <span className="divider"></span>
            </>
          ))}
        </div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ isMobileView: boolean }>`
  width: 30%;
  background-color: #2d2c3d;
  overflow-y: scroll;
  transition: transform 0.3s;

  @media screen and (max-width: 990px) {
    position: absolute;
    top: 0;
    transform: ${({ isMobileView }) =>
      isMobileView ? 'translateX(0)' : 'translateX(-100%)'};
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 20;
  }

  .loading-container {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
  }
  .table-container {
    display: flex;
    flex-direction: column;

    .headers {
      display: flex;
      width: 100%;
      justify-content: space-between;
      color: #5f5b7a;
      padding: 10px 0;

      span {
        width: 25%;
      }
    }
    .divider {
      width: 100%;
      height: 1px;
      background-color: #39374b;
    }
    .table-search {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;

      button {
        background-color: transparent;
        padding: 10px;
        border: 1px solid #5f5b7a;
        cursor: pointer;
        color: #5f5b7a;
        text-transform: uppercase;
      }
    }
    .table-input {
      height: 20px;
      background-color: #2d2c3d;
      border: none;
      border-bottom: 1px solid #5f5b7a;
      color: #5f5b7a;

      &:focus {
        outline: none;
      }

      &::placeholder {
        color: #5f5b7a;
      }
    }
  }
  .table-element {
    display: flex;
    color: white;
    padding: 10px;
    align-items: center;
    justify-content: space-between;

    div {
      width: 25%;
      display: flex;
      justify-content: left;
    }

    &:hover {
      background-color: #424057;
      cursor: pointer;
    }
    img {
      width: 25px;
    }
    .currencie {
      margin-left: 5px;
    }
    .capital {
      margin-left: 5px;
    }
  }
`;
