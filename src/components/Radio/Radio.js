import React from "react";
import { Span, Label, Box } from "..";
import { RadioGroupComponent, RadioBox } from "./styled";

let Radio = {};

const RadioGroup = ({
  className,
  onChange,
  name,
  value,
  label,
  color,
  options,
  required,
  error,
  style,
}) => {
  return (
    <RadioBox>
      {label && (
        <div style={{ marginTop: "10px" }}>
          <Label color={color}>
            {label} {required && <Span color="red">*</Span>}
          </Label>
        </div>
      )}
      <RadioGroupComponent
        className={className}
        onChange={onChange}
        name={name}
        value={value}
        options={options}
        style={style}
      />
      {error && (
        <Box>
          <Span color="red">{error}</Span>
        </Box>
      )}
    </RadioBox>
  );
};

const RadioGroupBtn = ({
  className,
  onChange,
  name,
  value,
  label,
  color,
  options,
  style,
  lbClassName,
}) => {
  return (
    <RadioBox>
      <div style={{ marginTop: "10px" }}>
        <Label className={lbClassName} color={color}>
          {label}
        </Label>
      </div>
      <RadioGroupComponent
        className={className}
        onChange={onChange}
        name={name}
        value={value}
        options={options}
        optionType="button"
        style={style}
      />
    </RadioBox>
  );
};

Radio.Group = RadioGroup;
Radio.GroupBtn = RadioGroupBtn;

export { Radio };
