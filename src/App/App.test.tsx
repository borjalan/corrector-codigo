import React from 'react';
import App from './App';
import { shallow } from 'enzyme';

test('renders learn react link', () => {
  const wrapper = shallow(<App />);
  const mainNode = wrapper.find('div');
  expect(mainNode.length).toEqual(1);
  expect(mainNode.prop('className')).toEqual('App');
});
