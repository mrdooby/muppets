import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import axios from 'axios';

function Checkout({ selectedStyle }) {
  const [skusInStock, setSkusInStock] = useState([]);
  const [selectedSku, setSelectedSku] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [maxQuantity, setMaxQuantity] = useState(null);
  const [clickSubmit, setClickSubmit] = useState(false);
  const [selectingSize, setSelectingSize] = useState(false);
  const [selectingQuantity, setSelectingQuantity] = useState(false);

  useEffect(() => {
    if (Object.keys(selectedStyle).length > 0) {
      const inStock = Object.keys(selectedStyle.skus).filter(
        (sku) => (selectedStyle.skus[sku].quantity > 0),
      );
      setSkusInStock(inStock);
      setSelectedSku(null);
      setSelectedQuantity(null);
      setMaxQuantity(null);
      setClickSubmit(false);
      setSelectingSize(false);
      setSelectingQuantity(false);
    }
  }, [selectedStyle]);

  // useEffect(() => {
  //   if (Object.keys(selectedStyle).length > 0 & skusInStock.length > 0) {
  //     setSelectedSku('1394805');
  //   }
  // }, [skusInStock]);

  useEffect(() => {
    if (Object.keys(selectedStyle).length > 0 && selectedSku) {
      let alreadyInCart = 0;
      axios({
        url: 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/cart',
        method: 'get',
        headers: {
          Authorization: process.env.GITKEY,
        },
        responseType: 'json',
      })
        .then((response) => {
          const cart = response.data;
          for (let i = 0; i < cart.length; i += 1) {
            if (cart[i].sku_id === Number(selectedSku)) {
              alreadyInCart = Number(cart[i].count);
            }
          }
          if (selectedStyle.skus[selectedSku]) {
            const availableToOrder = selectedStyle.skus[selectedSku].quantity - alreadyInCart;
            if (availableToOrder > 15) {
              setMaxQuantity(15);
              setSelectedQuantity(1);
            } else if (availableToOrder > 0) {
              setMaxQuantity(availableToOrder);
              setSelectedQuantity(1);
            } else {
              setMaxQuantity(0);
              setSelectedQuantity(0);
            }
          }
        });
    // } else if (selectedSku.length === 0) {
    //   setSelectedQuantity(null);
    //   setMaxQuantity(null);
    //   setClickSubmit(false);
    }
    // else {
    //   setS'1394805'
    // }
  }, [selectedSku]);

  const clickSubmitWithNoQuantity = () => {
    setClickSubmit(true);
    setSelectedSku(skusInStock[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setClickSubmit(false);
    let count = selectedQuantity;
    while (count > 0) {
      count -= 1;
      axios({
        url: 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/cart',
        method: 'post',
        headers: {
          Authorization: process.env.GITKEY,
        },
        data: {
          sku_id: selectedSku,
        },
      });
    }
    e.target.reset();
    setSelectedSku('');
  };

  const expandSelectSize = () => {
    setSelectingSize(!selectingSize);
    if (selectingQuantity) {
      setSelectingQuantity(false);
    }
  };

  const expandSelectQuantity = () => {
    setSelectingQuantity(true);
    if (selectingSize) {
      setSelectingSize(false);
    }
  };

  const handleSelectSize = (e) => {
    skusInStock.forEach((sku) => {
      if (selectedStyle.skus[sku].size === e.target.innerText) {
        setSelectedSku(sku);
        setSelectingSize(false);
        if (maxQuantity > 0) {
          setSelectedQuantity(1);
        } else {
          setSelectedQuantity(0);
        }
      }
    });
  };

  const handleSelectQuantity = (e) => {
    setSelectedQuantity(Number(e.target.innerText));
    setSelectingQuantity(false);
  };

  if (Object.keys(selectedStyle).length > 0
    && skusInStock.every((sku) => (Object.keys(selectedStyle.skus).indexOf(sku) !== -1))) {
    const quantityRange = [];
    if (maxQuantity !== null && maxQuantity > 0) {
      for (let i = 1; i <= maxQuantity; i += 1) {
        quantityRange.push(i);
      }
    }

    return (
      /*
      <Form onSubmit={handleSubmit}>
        {clickSubmit && (<div>Please select size</div>)}
        <select
          defaultValue={selectedSku}
          size={clickSubmit && skusInStock.length > 0 ? 3 : 0}
          onChange={(e) => { setSelectedSku(e.target.value); }}
        >
          {skusInStock.length === 0 && ((<option value="">OUT OF STOCK</option>))}
          {(!clickSubmit && skusInStock.length > 0) && (<option value="">Select Size</option>)}
          {skusInStock.length > 0 && (
            skusInStock.map((sku) => (
              <option value={sku} key={sku}>
                {selectedStyle.skus[sku].size}
              </option>
            )))}
        </select>
        {skusInStock.length > 0 && (
          <select onChange={(e) => { setSelectedQuantity(e.target.value); }}>
            {(selectedSku.length === 0 || (selectedSku.length > 0 && maxQuantity === null)) && (<option value="">-</option>)}
            {maxQuantity === 0 && (<option value={0}>Out Of Stock</option>)}
            {selectedSku.length > 0 && maxQuantity && (range.map((quantity) => (
              <option value={quantity} key={quantity}>
                {quantity}
              </option>
            )))}
          </select>
        )}
        {skusInStock.length > 0 && selectedSku.length === 0
        && (<button type="button" onClick={clickSubmitWithNoQuantity}>Add to Cart</button>)}
        {skusInStock.length > 0
        && selectedSku.length > 0
        && selectedQuantity
        && maxQuantity > 0
        && (<button type="submit">Add to Cart</button>)}
      </Form>
*/
      <Wrapper>
        <SizeSelector>
          {skusInStock.length === 0 && (
            <li>
              <button type="button">OUT OF STOCK</button>
            </li>
          )}
          {!selectedSku && (
            <li>
              <button type="button" onClick={expandSelectSize}>Select Size</button>
            </li>
          )}
          {skusInStock.length > 0 && selectingSize && (
            skusInStock.map((sku, index) => (
              <li key={index}>
                <button type="button" onClick={handleSelectSize}>{selectedStyle.skus[sku].size}</button>
              </li>
            ))
          )}
          {selectedSku && (
            <li>
              <button type="button" onClick={expandSelectSize}>{selectedStyle.skus[selectedSku].size}</button>
            </li>
          )}
        </SizeSelector>
        <QuantitySelector>
          {!selectedSku && (
            <li>
              <button type="button" onClick={expandSelectQuantity}>-</button>
            </li>
          )}
          {maxQuantity === 0 && (
            <li>
              <button type="button">OUT OF STOCK</button>
            </li>
          )}
          {selectedQuantity > 0 && (
            <li>
              <button type="button" onClick={expandSelectQuantity}>{selectedQuantity}</button>
            </li>
          )}
          {selectingQuantity && (
            quantityRange.map((quantity) => (
              <li key={quantity}>
                <button type="button" onClick={handleSelectQuantity}>{quantity}</button>
              </li>
            ))
          )}
          {console.log(selectedSku, selectedQuantity, typeof selectedQuantity)}
        </QuantitySelector>
      </Wrapper>
    );
  }
  return null;
}

Checkout.propTypes = {
  selectedStyle: PropTypes.shape({
    style_id: PropTypes.number,
    name: PropTypes.string,
    original_price: PropTypes.string,
    sale_price: PropTypes.string,
    'default?': PropTypes.bool,
    photos: PropTypes.arrayOf(PropTypes.shape({
      thumbnail_url: PropTypes.string,
      url: PropTypes.string,
    })),
    skus: PropTypes.objectOf(PropTypes.shape({
      quantity: PropTypes.number,
      size: PropTypes.string,
    })),
  }),
};

Checkout.defaultProps = {
  selectedStyle: PropTypes.object,
};

export default Checkout;

const Form = styled.form`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Wrapper = styled.div`

`;

const SizeSelector = styled.ul`
  list-style-type: none;

  & button {
    border: none;
  }
`;

const QuantitySelector = styled.ul`
  list-style-type: none;

  & button {
    border: none;
  }
`;
