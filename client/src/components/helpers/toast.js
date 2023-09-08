import { toast } from 'react-hot-toast';

export const CustomToastContent = () => (
  <div style={{ padding: '5px'}}>
    <p>
    You should handle errors in your asynchronous code.</p>
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px', marginTop: '5px'}}>
        <p style={{ fontSize: '15px'}}>For more information</p>
        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch" target="_blank" rel="noopener noreferrer">
          <button style={{border: '1px solid white', outline: 'none', backgroundColor: '#0D1318', color: '#fff', padding: '0.1rem', fontSize: '15px', borderRadius: '5px', cursor: 'pointer'}}>Click Here</button>
        </a>
    </div>
  </div>
);

export const customStyles = {
  border: '1px solid #0D1318',
  padding: '16px',
  fontSize: '19px',
  color: '#f2f2f2',
  backgroundColor: '#0D1318',
};


