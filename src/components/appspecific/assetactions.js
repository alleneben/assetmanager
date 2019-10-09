import React, { useState } from "react";
import PropTypes from "prop-types";

import * as s from '../../shardslib'

const AssetActions = ({ title, clsnm, placeholder, submit,data }) => {
    const [val, setval] = useState('');

    const onchange = (e) => {
      setval(e.target.value)
    }

    const handlesubmit = (f,fm) => {
      // if(val === '') return;
      submit(fm,'',f,'','');
    }
    const makeitems = () => {
      if(data === undefined) return '';
      const items = data.usf < 1 ? <s.ListGroupItem className="d-flex px-3 border-0">
      Usefullife of asset is {data.usf}. Edit it to a value greater than 0 before you can
      compute Depreciation.
      </s.ListGroupItem> : <>
        <s.ListGroupItem className="d-flex px-3 border-0">
          <s.InputGroup seamless className="mb-3">
            {/*<s.FormInput placeholder={placeholder} name="val" type="number" value={val} onChange={onchange}/>*/}
          </s.InputGroup>
        </s.ListGroupItem>
        <s.ListGroupItem className="d-flex px-3 border-0">
          <s.Button outline theme="accent" size="sm" onClick={() => handlesubmit('straight_new','Straight Line')}>
            <i className="material-icons">save</i> Straight Line
          </s.Button>
          <s.Button theme="accent" size="sm" onClick={() => handlesubmit('reducingbalance_new', 'Reducing Balance')} className="ml-auto">
            <i className="material-icons">file_copy</i> Reducing Bal
          </s.Button>
        </s.ListGroupItem> </>

        return items;
    }
    return (
      <s.Card small className={ clsnm }>
        <s.CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
        </s.CardHeader>

        <s.CardBody className="p-0">
          <s.ListGroup flush>
          { makeitems() }
          </s.ListGroup>
        </s.CardBody>
      </s.Card>
    );
}


AssetActions.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string
};

AssetActions.defaultProps = {
  title: "Depreciation Computations"
};

export default AssetActions;
