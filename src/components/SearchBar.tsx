import React from 'react';
import { IonSearchbar } from '@ionic/react';

interface SearchBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchText, setSearchText, placeholder }) => {
  return (
    <IonSearchbar
      value={searchText}
      onIonInput={(e: any) => setSearchText(e.target.value)}
      debounce={0} // Optional: reduce debounce to make the response faster
      placeholder={placeholder}
    />
  );
};

export default SearchBar;
