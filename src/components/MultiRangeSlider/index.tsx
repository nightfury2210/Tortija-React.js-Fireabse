import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Headline from 'components/Headline';
import { useTranslation } from 'react-i18next';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

interface Props {
  label?: string;
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (value: number[]) => void;
  className?: string;
}

const MultiRangeSlider: React.FC<Props> = ({ label, min, max, value, onChange, className }) => {
  const { t } = useTranslation();
  return (
    <div className={className}>
      {label && (
        <Headline className="mb-30" level={4}>
          {t(label)}
        </Headline>
      )}
      <Range
        min={min}
        max={max}
        defaultValue={[value.min, value.max]}
        tipFormatter={val => val}
        tipProps={{
          placement: 'top',
          visible: true,
        }}
        onAfterChange={onChange}
      />
    </div>
  );
};

export default MultiRangeSlider;
