import React, { useState} from 'react'

import * as s from '../../shardslib';
import * as c from '../../components';

import utils from '../../appstate/utils';
import api from  '../../appstate/api';


function ViewForm({item, closeviewform,cboc,flds }) {

  const [val, setValue]=useState(flds);

  const closeform = () => {
    closeviewform()
  }

  const formtype = (item) => {

    var content = item.mrl ?
    <>
      <c.InputField id="feUsername" md="6" label="Item" placeholder="Username" readOnly="readOnly" type='text'  value={val.nam} />
      <c.InputField id="feUsername" md="6" label="Price" placeholder="Username" readOnly="readOnly" type='text' value={val.prc} />
      <c.InputField id="feUsername" md="6" label="Qty" placeholder="Username" readOnly="readOnly" type='text' value={val.qty} />
      <c.InputField id="feUsername" md="6" label="Date" placeholder="Username" readOnly="readOnly" type='text' value={val.doc} />
      <c.InputField id="feUsername" md="6" label="Time" placeholder="Username" readOnly="readOnly" type='text' value={val.toc} />
      <c.InputField id="feUsername" md="6" label="Status" placeholder="Username" readOnly="readOnly" type='text' value={val.stn} />
    </>
    :
    <>

      <c.InputField id="AssetName" t='t' md="6" label="Asset Name" readOnly="readOnly" placeholder="Asset Name" type='text' name="namt" value={val.namt} />
      <c.InputField id="ModelNo" md="3" label="Model No" readOnly="readOnly" placeholder="Model No" type='text' name="mnot" value={val.mnot}/>
      <c.InputField id="Cost" md="3" label="Cost" readOnly="readOnly" placeholder="Cost" type='number' name="prcn" value={val.prcn} />
      <c.InputField id="Warranty" md="3" label="Warranty" readOnly="readOnly" placeholder="Warranty" type='number' name="warn" value={val.warn} />
      <c.InputField id="UsefulLife" md="3" label="Useful Life" readOnly="readOnly" placeholder="Useful Life" type='number' name="usfn" value={val.usfn}/>
      <c.SelectField id="Category" md="3" label="Category" readOnly="readOnly" name="cidn" value={val.cidn}  options={cboc}  />
      <c.InputArea id="Description" md="12" row="3" label="Description" readOnly="readOnly" placeholder="Description" type='text' name="dsct" value={val.dsct}/>

    </>

    return content;
  }
  return(
    <React.Fragment>
      <s.ListGroup flush>
        <s.ListGroupItem className="p-3">
          <s.Row>
            <s.Col>
              <s.Form>
                <s.Row form>
                  { formtype(item) }
                </s.Row>
                <s.Button theme="danger" onClick={closeform}>Close</s.Button>
              </s.Form>
            </s.Col>
          </s.Row>
        </s.ListGroupItem>
      </s.ListGroup>
    </React.Fragment>
  );
}


export default ViewForm;
