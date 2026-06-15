import { useState, useRef, useEffect, useCallback } from 'react'
import { Upload, ZoomIn, ZoomOut, Check, X, Camera } from 'lucide-react'

const PREVIEW = 240
const OUTPUT = 300

interface Props {
  currentSrc?: string | null
  onSave: (base64: string) => Promise<void>
  onCancel: () => void
}

export default function FotoCropper({ currentSrc, onSave, onCancel }: Props) {
  const [src, setSrc] = useState<string | null>(null)
  const [natW, setNatW] = useState(1)
  const [natH, setNatH] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [saving, setSaving] = useState(false)

  const imgRef = useRef<HTMLImageElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const drag = useRef({ active: false, startX: 0, startY: 0, posX: 0, posY: 0 })
  const live = useRef({ posX: 0, posY: 0, displayW: 0, displayH: 0 })

  const baseScale = Math.max(PREVIEW / Math.max(natW, 1), PREVIEW / Math.max(natH, 1))
  const displayW = natW * baseScale * zoom
  const displayH = natH * baseScale * zoom
  const imgLeft = PREVIEW / 2 + pos.x - displayW / 2
  const imgTop = PREVIEW / 2 + pos.y - displayH / 2

  live.current = { posX: pos.x, posY: pos.y, displayW, displayH }

  const clampXY = (x: number, y: number, dW: number, dH: number) => ({
    x: Math.min(Math.max(x, -Math.max(0, (dW - PREVIEW) / 2)), Math.max(0, (dW - PREVIEW) / 2)),
    y: Math.min(Math.max(y, -Math.max(0, (dH - PREVIEW) / 2)), Math.max(0, (dH - PREVIEW) / 2)),
  })

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setSrc(reader.result as string)
      setZoom(1)
      setPos({ x: 0, y: 0 })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const onImgLoad = () => {
    const img = imgRef.current!
    setNatW(img.naturalWidth || 1)
    setNatH(img.naturalHeight || 1)
  }

  const applyMove = useCallback((clientX: number, clientY: number) => {
    if (!drag.current.active) return
    const { displayW: dW, displayH: dH } = live.current
    const nx = drag.current.posX + (clientX - drag.current.startX)
    const ny = drag.current.posY + (clientY - drag.current.startY)
    const maxX = Math.max(0, (dW - PREVIEW) / 2)
    const maxY = Math.max(0, (dH - PREVIEW) / 2)
    setPos({
      x: Math.min(maxX, Math.max(-maxX, nx)),
      y: Math.min(maxY, Math.max(-maxY, ny)),
    })
  }, [])

  const stopDrag = useCallback(() => { drag.current.active = false }, [])

  useEffect(() => {
    const mm = (e: MouseEvent) => applyMove(e.clientX, e.clientY)
    const tm = (e: TouchEvent) => { e.preventDefault(); applyMove(e.touches[0].clientX, e.touches[0].clientY) }
    window.addEventListener('mousemove', mm)
    window.addEventListener('mouseup', stopDrag)
    window.addEventListener('touchmove', tm, { passive: false })
    window.addEventListener('touchend', stopDrag)
    return () => {
      window.removeEventListener('mousemove', mm)
      window.removeEventListener('mouseup', stopDrag)
      window.removeEventListener('touchmove', tm)
      window.removeEventListener('touchend', stopDrag)
    }
  }, [applyMove, stopDrag])

  const startDrag = (clientX: number, clientY: number) => {
    drag.current = { active: true, startX: clientX, startY: clientY, posX: live.current.posX, posY: live.current.posY }
  }

  const handleZoom = (newZoom: number) => {
    const bs = Math.max(PREVIEW / Math.max(natW, 1), PREVIEW / Math.max(natH, 1))
    const dW = natW * bs * newZoom
    const dH = natH * bs * newZoom
    setZoom(newZoom)
    setPos(prev => clampXY(prev.x, prev.y, dW, dH))
  }

  const handleSave = async () => {
    const img = imgRef.current
    if (!img || !src) return
    setSaving(true)
    try {
      const canvas = document.createElement('canvas')
      canvas.width = OUTPUT
      canvas.height = OUTPUT
      const ctx = canvas.getContext('2d')!
      ctx.beginPath()
      ctx.arc(OUTPUT / 2, OUTPUT / 2, OUTPUT / 2, 0, Math.PI * 2)
      ctx.clip()
      const scale = OUTPUT / PREVIEW
      const { posX, posY, displayW: dW, displayH: dH } = live.current
      ctx.drawImage(
        img,
        (PREVIEW / 2 + posX - dW / 2) * scale,
        (PREVIEW / 2 + posY - dH / 2) * scale,
        dW * scale,
        dH * scale
      )
      await onSave(canvas.toDataURL('image/jpeg', 0.85))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-green-400" />Foto de Perfil
          </h3>
          <button onClick={onCancel}
            className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!src ? (
          <div className="flex flex-col items-center gap-5">
            <div
              className="relative w-44 h-44 rounded-full bg-zinc-800 border-2 border-dashed border-zinc-600 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors overflow-hidden"
              onClick={() => fileRef.current?.click()}>
              {currentSrc ? (
                <img src={currentSrc} className="w-full h-full object-cover" alt="" />
              ) : (
                <>
                  <Camera className="w-10 h-10 text-gray-600 mb-2" />
                  <p className="text-gray-500 text-xs">Clique para escolher</p>
                </>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 font-semibold px-5 py-2.5 rounded-xl transition-all">
              <Upload className="w-4 h-4" />{currentSrc ? 'Trocar Foto' : 'Escolher Foto'}
            </button>
            {currentSrc && (
              <button onClick={onCancel}
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                Manter foto atual
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-center text-gray-500 text-xs mb-4">
              Arraste para centralizar · use o controle para dar zoom
            </p>

            <div className="flex justify-center mb-4">
              <div
                style={{ width: PREVIEW, height: PREVIEW, borderRadius: '50%', overflow: 'hidden', position: 'relative', cursor: 'grab', userSelect: 'none', flexShrink: 0 }}
                className="border-2 border-green-500/50 shadow-xl shadow-green-500/10"
                onMouseDown={e => { e.preventDefault(); startDrag(e.clientX, e.clientY) }}
                onTouchStart={e => { e.preventDefault(); startDrag(e.touches[0].clientX, e.touches[0].clientY) }}
              >
                <img
                  ref={imgRef}
                  src={src}
                  onLoad={onImgLoad}
                  draggable={false}
                  style={{
                    position: 'absolute',
                    left: imgLeft,
                    top: imgTop,
                    width: displayW,
                    height: displayH,
                    maxWidth: 'none',
                    maxHeight: 'none',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                  alt=""
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-5 px-1">
              <button
                onClick={() => handleZoom(Math.max(1, Math.round((zoom - 0.1) * 100) / 100))}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-gray-400 hover:text-white shrink-0">
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range" min="1" max="3" step="0.02" value={zoom}
                onChange={e => handleZoom(Number(e.target.value))}
                className="flex-1 accent-green-500"
                style={{ height: 6, borderRadius: 9999 }}
              />
              <button
                onClick={() => handleZoom(Math.min(3, Math.round((zoom + 0.1) * 100) / 100))}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-gray-400 hover:text-white shrink-0">
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => fileRef.current?.click()}
              className="w-full text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-1.5 mb-4">
              <Upload className="w-3 h-3" />Escolher outra foto
            </button>

            <div className="flex gap-3">
              <button onClick={onCancel}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-gray-400 hover:text-white font-semibold py-2.5 rounded-xl transition-all">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-green-500/20">
                <Check className="w-4 h-4" />{saving ? 'Salvando...' : 'Salvar Foto'}
              </button>
            </div>
          </>
        )}

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  )
}
