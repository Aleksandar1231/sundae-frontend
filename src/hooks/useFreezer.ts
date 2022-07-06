import { useContext } from 'react';
import { Context } from '../contexts/FreezerProvider/FreezerProvider';

const useFreezer = () => {
    const { Freezer } = useContext(Context);
    return Freezer;
};

export default useFreezer;