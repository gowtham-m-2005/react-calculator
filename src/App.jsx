import { useReducer } from "react"
import "./index.css"
import DigitButton from "./DigitButton.jsx"
import OperationButton from "./OperationButton.jsx"

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate",
}

const initialState = {
  currentOperand: "",
  previousOperand: "",
  operation: null,
  overwrite: false,
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }

      if (payload.digit === "0" && state.currentOperand === "0") return state
      if (payload.digit === "." && state.currentOperand.includes(".")) return state

      return {
        ...state,
        currentOperand: `${state.currentOperand}${payload.digit}`,
      }

    case ACTIONS.CLEAR:
      return initialState

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand === "") {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previousOperand === "") {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: "",
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: "",
      }

    case ACTIONS.EVALUATE:
      if (
        state.currentOperand === "" ||
        state.previousOperand === "" ||
        state.operation == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        currentOperand: evaluate(state),
        previousOperand: "",
        operation: null,
      }

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: "",
        }
      }

      if (state.currentOperand === "") return state

      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: "",
        }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }

    default:
      return state
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const curr = parseFloat(currentOperand)

  if (isNaN(prev) || isNaN(curr)) return ""

  let computation
  switch (operation) {
    case "+":
      computation = prev + curr
      break
    case "-":
      computation = prev - curr
      break
    case "*":
      computation = prev * curr
      break
    case "/":
      computation = prev / curr
      break
    default:
      return ""
  }

  return computation.toString()
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] =
    useReducer(reducer, initialState)

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {previousOperand} {operation}
        </div>
        <div className="current-operand">{currentOperand}</div>
      </div>

      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>

      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>

      <OperationButton operation="/" dispatch={dispatch} />

      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />

      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />

      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <button></button>

      <DigitButton digit="0" dispatch={dispatch} />

      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  )
}

export default App