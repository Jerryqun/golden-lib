import React from 'react';

export default ({ value }: any) => {
  const type = typeof value;
  let node: any =
    typeof value?.toString === 'function' ? value.toString() : value;
  if (node === null) {
    node = 'null';
  } else if (node === undefined) {
    node = 'undefined';
  }
  return <div className={`basic-col basic-col-${type}`}>{node}</div>;
};
