import { useSvgDrawing } from 'react-hooks-svgdrawing'
import { useState, useCallback, useEffect } from 'react'
import Pressure from 'pressure'

const getRandomInt = (max) =>
  Math.floor(Math.random() * Math.floor(max))
// const getRandomColor = "#FFF00"


export const Drawing = () => {
  const [
    divRef,
    {
      instance,
      changePenColor,
      changePenWidth,
      getSvgXML,
      download,
      undo,
      clear
    }
  ] = useSvgDrawing({
    penWidth: 3,
    penColor: '#000'
  })
  const [xml, setXml] = useState('')
  const [penMode, setPenMode] = useState('normal')
  const [penWidth, setPenWidth] = useState(5)
  const [penThinnerWidth, setPenThinnerWidth] = useState(0)
  // const handleColor = useCallback(() => {
  //   changePenColor(getRandomColor())
  // }, [changePenColor])

  const handlePenWidth = useCallback(
    (e) => {
      setPenWidth(Number(e.target.value))
      changePenWidth(Number(e.target.value))
    },
    [changePenWidth]
  )
  const handleChangeXML = useCallback(() => {
    setXml(getSvgXML())
  }, [getSvgXML])
  const handleChangeMode = useCallback(
    (e) => {
      setPenMode(e.target.value)
    },
    []
  )
  const handleClickDownload = useCallback(
    (ext) => () => {
      download(ext)
    },
    [download]
  )
  const pressureChange = useCallback(
    (force, event) => {
      setPenThinnerWidth(30 - Math.floor(force * 40))
    },
    [setPenThinnerWidth]
  )

  useEffect(() => {
    if (penMode === 'normal') return

    const stopId = setInterval(() => {
      // if (penMode === 'rainbow') {
      //   changePenColor(getRandomColor())
      // }
      if (penMode === 'random') {
        changePenWidth(getRandomInt(50) + 5)
      }
      if (penMode == 'thinner') {
        changePenWidth(penThinnerWidth)
      }
    }, (instance && instance.delay) || 20)
    return () => clearInterval(stopId)
  }, [penMode, changePenWidth, changePenColor, instance, penThinnerWidth])

  // Pressure -> https://github.com/stuyam/pressure
  useEffect(() => {
    if (!divRef.current) return
    Pressure.set(divRef.current, {
      change: pressureChange
    })
  }, [divRef, pressureChange])
  return (
    <div>
      <fieldset>
        <label>
          <input
            type="checkbox"
            checked={penMode === 'normal'}
            value="normal"
            onChange={handleChangeMode}
          />
          Normal pen.
        </label>
        <label>
          <input
            type="checkbox"
            checked={penMode === 'thinner'}
            value="thinner"
            onChange={handleChangeMode}
          />
          Pen becoming thinner.
        </label>
        <label>
          <input
            type="checkbox"
            checked={penMode === 'random'}
            value="random"
            onChange={handleChangeMode}
          />
          Pen becoming Random Width.
        </label>
        <label>
          <input
            type="checkbox"
            checked={penMode === 'rainbow'}
            value="rainbow"
            onChange={handleChangeMode}
          />
          Rainbow pen.
        </label>
        {['normal', 'rainbow'].includes(penMode) && (
          <div>
            pen width
            <input
              type="range"
              value={penWidth}
              min={1}
              max={50}
              onChange={handlePenWidth}
            />
          </div>
        )}
        {/* {penMode !== 'rainbow' && (
          <button onClick={handleColor}>Change Color</button>
        )} */}
      </fieldset>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flexWrap'
        }}
      >
        <div>
          <div
            ref={divRef}
            style={{
              width: 500,
              height: 500,
              border: '1px solid #eee',
              margin: 'auto'
            }}
            onTouchEnd={handleChangeXML}
            onMouseLeave={handleChangeXML}
          />
          <button onClick={undo}>Undo</button>
          <button onClick={clear}>Clear</button>
          <button onClick={handleClickDownload('svg')}>Download SVG</button>
          <button onClick={handleClickDownload('png')}>Download PNG</button>
          <button onClick={handleClickDownload('jpg')}>Download JPG</button>
        </div>
        <div
          style={{
            fontSize: '8px'
          }}
        >
          {xml}
        </div>
      </div>
    </div>
  )
}
