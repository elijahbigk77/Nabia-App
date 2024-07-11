import React from 'react';
import { IonSearchbar } from '@ionic/react';

interface SearchBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchText, setSearchText, placeholder = "Search..." }) => {
  return (
    <IonSearchbar
      value={searchText}
      onIonChange={(e) => setSearchText(e.detail.value!)}
      placeholder={placeholder}
    />
  );
};

export default SearchBar;
