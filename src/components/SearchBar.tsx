import React from 'react';
import { IonSearchbar } from '@ionic/react';
import './SerachBar.css';

interface SearchBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
  placeholder: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchText, setSearchText, placeholder, className }) => {
  return (
    <IonSearchbar
      value={searchText}
      onIonInput={(e: any) => setSearchText(e.target.value)}
      debounce={0} 
      placeholder={placeholder}
      className={`search-bar ${className}`}
    />
  );
};

export default SearchBar;
