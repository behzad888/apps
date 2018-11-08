// Copyright 2017-2018 @polkadot/ui-qr authors & contributors
// This software may be modified and distributed under the terms
// of the APL2 license. See the LICENSE file for details.

import { BaseProps } from './types';

import './QrCode.css';

import React from 'react';
import qrcode from 'qrcode-generator';

type Props = BaseProps & {
  value: string
};

type State = {
  image: string | null,
  value: string | null
};

export default class QrCode extends React.PureComponent<Props, State> {
  state = {
    image: null,
    value: null
  };

  static getDerivedStateFromProps ({ value }: Props, prevState: State) {
    if (value === prevState.value) {
      return null;
    }

    const qr = qrcode(0, 'M');

    qr.addData(value, 'Byte');
    qr.make();

    return {
      image: qr.createDataURL(16, 0),
      value
    };
  }

  render () {
    const { className, style } = this.props;
    const { image } = this.state;

    if (!image) {
      return null;
    }

    return (
      <div
        className={`ui--qr-QrCode ${className}`}
        style={style}
      >
        <img src={image} />
      </div>
    );
  }
}
