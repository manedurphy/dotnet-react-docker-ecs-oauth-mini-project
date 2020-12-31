import React from 'react';
import { ProtectedDataState } from '../redux/slices/protectedDataSlice';
import { Box } from './OAuth/oauth-styles';

interface DataItemProps {
  data: ProtectedDataState;
}

const DataItem: React.FC<DataItemProps> = (props): JSX.Element => (
  <Box>
    <p>Date: {props.data.date.slice(0, 10)}</p>
    <p>TempC: {props.data.temperatureC} Degrees</p>
    <p>TempF: {props.data.temperatureF} Degrees</p>
    <p>Summary: {props.data.summary}</p>
  </Box>
);

export default DataItem;
