import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

describe('component Device DeviceInformation', () => {
  it('render', () => {
    const props = {
      device: {},
      __: str => str,
    };

    const comp = shallow(
      <Presenter {...props} />
    );

    expect(comp.find('DefList').length).toEqual(1);
  });
});
