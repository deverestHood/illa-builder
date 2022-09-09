import { FC, HTMLAttributes, useCallback, useRef } from "react"
import { Divider } from "@illa-design/divider"
import { DragBar } from "@/page/App/components/Actions/DragBar"
import {
  applyDebuggerStyle,
  containerStyle,
  errorContentStyle,
  titleStyle,
} from "./style"
import { CloseIcon } from "@illa-design/icon"
import { useDispatch, useSelector } from "react-redux"
import { getExecutionDebuggerData } from "@/redux/currentApp/executionTree/executionSelector"
import { isArray } from "@illa-design/system"
import { configActions } from "@/redux/config/configSlice"
import { isOpenDebugger } from "@/redux/config/configSelector"
import { ErrorItem } from "@/page/App/components/Debugger/components/ErrorItem"

const DebuggerDefaultHeight = 300

export const Debugger: FC<HTMLAttributes<HTMLDivElement>> = (props) => {
  const dispatch = useDispatch()
  const panelRef = useRef<HTMLDivElement>(null)
  const debuggerData = useSelector(getExecutionDebuggerData)
  const debuggerVisible = useSelector(isOpenDebugger)
  console.log(debuggerData, "debuggerData")

  const handleClickDebuggerIcon = useCallback(() => {
    dispatch(configActions.updateDebuggerVisible(!debuggerVisible))
  }, [debuggerVisible])

  return (
    <div
      className={props.className}
      css={applyDebuggerStyle(DebuggerDefaultHeight)}
      ref={panelRef}
    >
      <DragBar resizeRef={panelRef} minHeight={DebuggerDefaultHeight} />
      <Divider direction="horizontal" />
      <div css={titleStyle}>
        <span>Errors</span>
        <CloseIcon onClick={handleClickDebuggerIcon} />
      </div>
      <div css={containerStyle}>
        <div css={errorContentStyle}>
          {Object.keys(debuggerData)?.map((name, index) => {
            const error = debuggerData[name]
            if (isArray(error)) {
              return error?.map((item) => {
                return <ErrorItem key={index} pathName={name} item={item} />
              })
            }
            return <ErrorItem pathName={name} item={error} />
          })}
        </div>
      </div>
    </div>
  )
}

Debugger.displayName = "Debugger"
