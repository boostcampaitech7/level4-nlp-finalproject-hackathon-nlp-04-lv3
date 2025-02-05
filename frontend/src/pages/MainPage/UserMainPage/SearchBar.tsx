import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { fetchVocabData } from '../../../services/mainPage';

interface SearchBarProps {
  className?: string;
}

const SearchBar = ({ className = '' }: SearchBarProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      const data = await fetchVocabData(searchTerm);
      navigate(`/vocab/${data.vocab_id}`, { state: { vocabData: data } });
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className={`h-[97.19px] w-full px-[41.57px] py-[23.10px] bg-surface-primary-2 rounded-[36.95px] inline-flex items-center gap-[23.10px] ${className}`}>
      <FaSearch
        className="text-[#707070] cursor-pointer"
        style={{ width: '34.64px', height: '34.64px', fontSize: '34.64px' }}
        onClick={handleSearch}
      />
      <input
        type="text"
        placeholder="단어 검색하기"
        className="w-[653.60px] text-[36.95px] font-medium leading-[50.81px] text-[#707070] placeholder-[#707070] focus:outline-none bg-transparent"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyPress}
      />
    </div>
  );
};

export default SearchBar;
