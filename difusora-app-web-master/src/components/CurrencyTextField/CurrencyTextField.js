import React from "react"
import PropTypes from "prop-types"
import AutoNumeric from "autonumeric"
import { withStyles } from "@material-ui/styles"
import { TextField, InputAdornment } from "@material-ui/core"

const styles = theme => ({
  textField: props => ({
    textAlign: props.textAlign || "right",
  }),
})

class CurrencyTextField extends React.Component {
  constructor(props) {
    super(props)
    this.getValue = this.getValue.bind(this)
    this.callEventHandler = this.callEventHandler.bind(this)
  }

  componentDidMount() {
    const { currencySymbol, ...others } = this.props
    this.autonumeric = new AutoNumeric(this.input, this.props.value, {
      ...this.props.preDefined,
      ...others,
      onChange: undefined,
      onFocus: undefined,
      onBlur: undefined,
      onKeyPress: undefined,
      onKeyUp: undefined,
      onKeyDown: undefined,
      watchExternalChanges: false,
    })
  }
  componentWillUnmount() {
    this.autonumeric.remove()
  }

  componentWillReceiveProps(newProps) {
    const isValueChanged =
      this.props.value !== newProps.value && this.getValue() !== newProps.value

    if (isValueChanged) {
      this.autonumeric.set(newProps.value)
    }
  }

  getValue() {
    if (!this.autonumeric) return
    const valueMapper = {
      string: numeric => numeric.getNumericString(),
      number: numeric => numeric.getNumber(),
    }
    return valueMapper[this.props.outputFormat](this.autonumeric)
  }
  callEventHandler(event, eventName) {
    if (!this.props[eventName]) return
    this.props[eventName](event, this.getValue())
  }
  render() {
    const {
      classes,
      currencySymbol,
      inputProps,
      InputProps,
      ...others
    } = this.props

    const otherProps = {}
    ;[
      "id",
      "label",
      "className",
      "autoFocus",
      "variant",
      "style",
      "error",
      "disabled",
      "type",
      "name",
      "defaultValue",
      "tabIndex",
      "fullWidth",
      "rows",
      "rowsMax",
      "select",
      "required",
      "helperText",
      "unselectable",
      "margin",
      "SelectProps",
      "multiline",
      "size",
      "FormHelperTextProps",
      "placeholder",
    ].forEach(prop => (otherProps[prop] = this.props[prop]))

    return (
      <TextField
        inputRef={ref => (this.input = ref)}
        onChange={e => this.callEventHandler(e, "onChange")}
        onFocus={e => this.callEventHandler(e, "onFocus")}
        onBlur={e => this.callEventHandler(e, "onBlur")}
        onKeyPress={e => this.callEventHandler(e, "onKeyPress")}
        onKeyUp={e => this.callEventHandler(e, "onKeyUp")}
        onKeyDown={e => this.callEventHandler(e, "onKeyDown")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">{currencySymbol}</InputAdornment>
          ),
          ...InputProps,
        }}
        inputProps={{
          className: classes.textField,
          ...inputProps,
        }}
        {...otherProps}
      />
    )
  }
}

CurrencyTextField.propTypes = {
  type: PropTypes.oneOf(["text", "tel", "hidden"]),
  variant: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  textAlign: PropTypes.oneOf(["right", "left", "center"]),
  tabIndex: PropTypes.number,
  autoFocus: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyPress: PropTypes.func,
  onKeyUp: PropTypes.func,
  onKeyDown: PropTypes.func,
  currencySymbol: PropTypes.string,
  decimalCharacter: PropTypes.string,
  decimalCharacterAlternative: PropTypes.string,
  decimalPlaces: PropTypes.number,
  decimalPlacesShownOnBlur: PropTypes.number,
  decimalPlacesShownOnFocus: PropTypes.number,
  digitGroupSeparator: PropTypes.string,
  leadingZero: PropTypes.oneOf(["allow", "deny", "keep"]),
  maximumValue: PropTypes.string,
  minimumValue: PropTypes.string,
  negativePositiveSignPlacement: PropTypes.oneOf(["l", "r", "p", "s"]),
  negativeSignCharacter: PropTypes.string,
  outputFormat: PropTypes.oneOf(["string", "number"]),
  selectOnFocus: PropTypes.bool,
  positiveSignCharacter: PropTypes.string,
  readOnly: PropTypes.bool,
  preDefined: PropTypes.object,
}

CurrencyTextField.defaultProps = {
  type: "text",
  variant: "standard",
  currencySymbol: "R$",
  outputFormat: "number",
  textAlign: "right",
  maximumValue: "10000000000000",
  minimumValue: "-10000000000000",
}
export default withStyles(styles)(CurrencyTextField)

export const predefinedOptions = AutoNumeric.getPredefinedOptions()