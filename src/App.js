import React, {useState, useEffect} from 'react';
import './App.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faCheck, faTrashAlt, faMinusCircle, faPlusCircle} from '@fortawesome/free-solid-svg-icons';




export default function App() {

  const URL = 'http://localhost/kauppalista_back/';
  const [refreshApp, setRefreshApp] = useState(0);

  // lisäysrivi
  const ItemBox = () => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('1');
    const [items, setItems] = useState([]);

    const newItem = (e) => {
      e.preventDefault();
      let status = 0;
      fetch(URL + 'lisaa.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          amount: amount
        })
      })
      .then(res => {
        status = parseInt(res.status);
        return res.json();
      })
      .then(
        (res) => {
          if (status === 200) {
            setItems(items => [...items, res]);
            setName('');
            setAmount('');
            setRefreshApp(refreshApp === 1 ? 0 : 1);
          } else {
            alert(res.error);
          }
        }, (error) => {
          alert(error);
        }
      )
    }
    return (
      <div className="row col-12">
        <form onSubmit={newItem}>
          <input value={name} onChange={e => setName(e.target.value)} 
            placeholder="tuotteen nimi" className="col-7" maxLength="30"/>
          <input value={amount} onChange={e => setAmount(e.target.value)} 
            placeholder="määrä" className="col-3" type="number" min="1"/>
          <button className="col-1"> <FontAwesomeIcon icon={faPlus} /> </button>
        </form>
      </div>
    )
  }

  // lista tuotteista
  const ItemList = () => {
    const [items, setItems] = useState([]);

    // hae tuotelista
    useEffect(() => {
      let status = 0;
  
      fetch(URL + 'nayta.php')
      .then(res => {
        status = parseInt(res.status);
        return res.json();
      }) 
      .then(
        (res) => {
          if (status === 200) {
            setItems(res);
          } else {
            alert(res.error);
          }
        }, (error) => {
          alert(error);
        }
      )
    }, [])
  
    // muokkaa 
    const editItem = (e, nro, name, amount) => {
      e.preventDefault();
      let status = 0;
      fetch(URL + 'muokkaa.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nro: nro,
          name: name,
          amount: amount
        })
      })
      .then(res => {
        status = parseInt(res.status);
        return res.json();
      })
      .then(
        (res) => {
          if (status === 200) {
            setRefreshApp(refreshApp === 1 ? 0 : 1);
          } else {
            alert(res.error);
          }
        }, (error) => {
          alert(error);
        }
      )
    }

    // poista
    const deleteItem = (e, nro) => {
      let status = 0;
      fetch(URL + 'poista.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nro: nro
        })
      })
      .then(res => {
        status = parseInt(res.status);
        return res.json();
      })
      .then(
        (res) => {
          if (status === 200) {
            setRefreshApp(refreshApp === 1 ? 0 : 1);
          } else {
            alert(res.error);
          }
        }, (error) => {
          alert(error);
        }
      )
    }

  
    // tuoterivi
    const Item = (props) => {
      const [isEditing, setIsEditing] = useState(0);
      const [newname, setNewname] = useState(props.info.name);
      const [newamount, setNewamount] = useState(props.info.amount);

      return (
        <div >
          {isEditing === 1 ? (
            <div className="row col-12">
              <form onSubmit={(e) => editItem(e, props.info.nro, newname, newamount)} >
                <input value={newname} onChange={e => setNewname(e.target.value)} 
                  className="col-7" maxLength="20"/>
                <input value={newamount} onChange={e => setNewamount(e.target.value)} 
                  className="col-3" type="number" min="0"/>
                <button className="col-1"><FontAwesomeIcon icon={faCheck} /></button>
              </form>
            </div>
          ) : (
            <table className="table">
              <tbody>
                <tr className="d-flex">
                  <td className="col-1">
                    <input type="checkbox"/>
                  </td>
                  <td className="col-7" onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(1);
                  }}>
                    {props.info.name}
                  </td>
                  <td className="col-3">
                    {/* <FontAwesomeIcon icon={faMinusCircle} /> */}
                    {props.info.amount}
                    {/* <FontAwesomeIcon icon={faPlusCircle} /> */}
                  </td>
                  <td className="col-1">
                    <FontAwesomeIcon icon={faTrashAlt} 
                      onClick={(e) => deleteItem(e, props.info.nro)} />
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )
    }

    return (
      <div className="">
        {items.map((item) => (
          <Item key={item.nro} info={item} />
        ))}
      </div>
    )
    
  }
  
  return (
    <div className="main container-fluid pt-2 pb-2">
      <div className="container">
        <h2>Kauppalista</h2>
        <ItemBox/>
        <div className="mt-2" >
          <ItemList />
        </div>
      </div>
      <footer className="mt-5 pl-2 pt-2">
        <div>
          <p>Joanna Turunen 2021</p>
        </div>
      </footer>
    </div>
  );
}


