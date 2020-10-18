
class DraggableTable extends SportTable {
    constructor (containerId, htmlClass, id) {
      super(containerId, htmlClass, id)
      this.currRow = null
      this.dragElem = null
      this.mouseDownX = 0
      this.mouseDownY = 0
      this.mouseX = 0
      this.mouseY = 0
      this.mouseDrag = false     
    }
    bindMouse () {
        this.table = document.getElementById(this.id)
        this.table.addEventListener('mousedown', event => {
        if (event.button != 0) return true
        let target = this.getTargetRow(event.target)
        if (target) {
          this.currRow = target
          this.addDraggableRow(target)
          this.currRow.classList.add('is-dragging')
          let coords = this.getMouseCoords(event)
          this.mouseDownX = coords.x
          this.mouseDownY = coords.y
          this.mouseDrag = true
        }
      })
      document.addEventListener('mousemove', event => {
        if (!this.mouseDrag) return
        let coords = this.getMouseCoords(event)
        this.mouseX = coords.x - this.mouseDownX
        this.mouseY = coords.y - this.mouseDownY
        this.moveRow(this.mouseX, this.mouseY)
      })
      document.addEventListener('mouseup', event => {
        if (!this.mouseDrag) return
        this.currRow.classList.remove('is-dragging')
        this.table.removeChild(this.dragElem)
        this.dragElem = null
        this.mouseDrag = false
        
        for (let i = 1; i < this.table.rows.length; i++) {
          //zajišťuje, že pořadí zůstává správně
          this.table.rows[i].cells[0].innerHTML = `${i}.`
        }
      })
    }
  
    swapRow (row, index) {
      this.tbody = this.table.querySelector(`#${this.id}>tbody`)
      let currIndex = Array.from(this.tbody.children).indexOf(this.currRow),
        row1 = currIndex > index ? this.currRow : row,
        row2 = currIndex > index ? row : this.currRow
        
        this.tbody.insertBefore(row1, row2)
    }
  
    moveRow (x, y) {
      this.dragElem.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)'
      let dPos = this.dragElem.getBoundingClientRect(),
        currStartY = dPos.y,
        currEndY = currStartY + dPos.height,
        rows = this.getRows()
      for (let i = 0; i < rows.length; i++) {
        let rowElem = rows[i],
          rowSize = rowElem.getBoundingClientRect(),
          rowStartY = rowSize.y,
          rowEndY = rowStartY + rowSize.height
        if (
          this.currRow !== rowElem &&
          this.isIntersecting(currStartY, currEndY, rowStartY, rowEndY)
        ) {
          if (Math.abs(currStartY - rowStartY) < rowSize.height / 2)
            this.swapRow(rowElem, i)
        }
      }
    }
  
    addDraggableRow (target) {
      this.dragElem = target.cloneNode(true)
      this.dragElem.classList.add('draggable-table__drag')
      this.dragElem.style.height = this.getStyle(target, 'height')
      this.dragElem.style.background = this.getStyle(target, 'backgroundColor')
      for (let i = 0; i < target.children.length; i++) {
        let oldTD = target.children[i],
          newTD = this.dragElem.children[i]
        newTD.style.width = this.getStyle(oldTD, 'width')
        newTD.style.height = this.getStyle(oldTD, 'height')
        newTD.style.padding = this.getStyle(oldTD, 'padding')
        newTD.style.margin = this.getStyle(oldTD, 'margin')
      }
      this.table.appendChild(this.dragElem)
      let tPos = target.getBoundingClientRect(),
        dPos = this.dragElem.getBoundingClientRect()
      this.dragElem.style.bottom = dPos.y - tPos.y - tPos.height + 'px'
      this.dragElem.style.left = '-1px'
      document.dispatchEvent(
        new MouseEvent('mousemove', {
          view: window,
          cancelable: true,
          bubbles: true
        })
      )
    }
  
    getRows () {
      return this.table.querySelectorAll(`#${this.id}>tbody tr`)
    }
  
    getTargetRow (target) {
      let elemName = target.tagName.toLowerCase()
      if (elemName == 'tr') return target
      if (elemName == 'td') return target.closest('tr')
    }
  
    getMouseCoords (event) {
      return {
        x: event.clientX,
        y: event.clientY
      }
    }
  
    getStyle (target, styleName) {
      let compStyle = getComputedStyle(target),
        style = compStyle[styleName]
      return style ? style : null
    }
  
    isIntersecting (min0, max0, min1, max1) {
      return (
        Math.max(min0, max0) >= Math.min(min1, max1) &&
        Math.min(min0, max0) <= Math.max(min1, max1)
      )
    }
  }
  
 