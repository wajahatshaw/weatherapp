import React from 'react';
import { View, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setUnit } from '../redux/weather.slice';
import { RootState } from '../redux/store';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const unit = useSelector((state: RootState) => state.unit);

  return (
    <View style={{ padding: 16 }}>
      <Button
        title={`Toggle to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
        onPress={() => dispatch(setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius'))}
      />
    </View>
  );
};

export default SettingsScreen;
