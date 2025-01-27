import Place from 'react-algolia-places';
import cx from 'classnames';

const Search = ({ setAttributes, isSelected }) => {
    const handleOnChange = ({suggestion} = {}) => {
        if(suggestion) {
            const {latlng, value} = suggestion;
            setAttributes({...latlng, content: value});
        }
    }

    return (
        <div className={
            cx('nachhaltigkeitskarte-leipzig-header', {
              'is-nachhaltigkeitskarte-leipzig-selected': isSelected 
            })} >
            <Place onChange={handleOnChange}/>
        </div>
    )
}
export default Search