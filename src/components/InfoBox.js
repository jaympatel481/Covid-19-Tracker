import React from 'react';
import {Card, CardBody, CardText, CardTitle} from 'reactstrap';
import './InfoBox.css';

function InfoBox({title, cases, total, active, ...props})
{
    return (
        <Card className={`text-center ${active && "infoBox--selected"} 
        `}
        onClick={props.onClick}
        >
            <CardBody>
                <CardTitle><h4>{title}</h4></CardTitle>
                <CardText className={` ${"infoBox__cases--green"}`}>{cases} Today</CardText>
                <CardText>{total} Total</CardText>
            </CardBody>
        </Card>
    );
}

export default InfoBox;