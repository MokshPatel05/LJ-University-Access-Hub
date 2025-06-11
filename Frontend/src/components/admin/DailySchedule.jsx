"use client"

import { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export default function DailySchedule() {
  const [timetableData, setTimetableData] = useState([
    {
      day: "MON",
      slots: [
        {
          time: "08:45 to 09:45",
          classes: [
            { subject: "PYTHON-2", faculty: "VHA", room: "406-1" },
            { subject: "DM", faculty: "DDP", room: "403" },
            { subject: "TOC", faculty: "PDO", room: "404" },
            { subject: "PYTHON-2", faculty: "TAT", room: "406-3" },
            { subject: "DM", faculty: "MSS", room: "405" },
            { subject: "FSD-2", faculty: "NAS", room: "407" },
            { subject: "FSD-2", faculty: "PBZ", room: "406-4" },
            { subject: "TOC", faculty: "DPS", room: "409" },
          ],
        },
        {
          time: "09:45 to 10:45",
          classes: [
            { subject: "TOC", faculty: "DPS", room: "403" },
            { subject: "DM", faculty: "BNS", room: "404" },
            { subject: "TOC", faculty: "PDO", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "COA", faculty: "SSD", room: "409" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
          ],
        },
        {
          time: "BREAK",
          classes: Array(8).fill({ subject: "break", faculty: "", room: "" }),
        },
        {
          time: "11:30 to 12:30",
          classes: [
            { subject: "TOC", faculty: "PDO", room: "403" },
            { subject: "FSD-2", faculty: "NAS", room: "406-1" },
            { subject: "PYTHON-2", faculty: "VHA", room: "406-3" },
            { subject: "TOC", faculty: "DPS", room: "404" },
            { subject: "FSD-2", faculty: "PSP", room: "407" },
            { subject: "COA", faculty: "SSD", room: "405" },
            { subject: "COA", faculty: "VBY", room: "409" },
            { subject: "PYTHON-2", faculty: "TAT", room: "406-4" },
          ],
        },
        {
          time: "12:30 to 01:30",
          classes: [
            { subject: "COA", faculty: "VBY", room: "403" },
            { subject: "COA", faculty: "SSD", room: "404" },
            { subject: "DM", faculty: "FRT", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "DM", faculty: "MSS", room: "409" },
          ],
        },
        {
          time: "01:45 to 02:45",
          classes: [
            { subject: "none", faculty: "", room: "" },
            { subject: "COA", faculty: "SSD", room: "403" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "COA", faculty: "VBY", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "DM", faculty: "DDP", room: "409" },
          ],
        },
      ],
    },
    {
      day: "TUE",
      slots: [
        {
          time: "08:45 to 09:45",
          classes: [
            { subject: "TOC", faculty: "PDO", room: "403" },
            { subject: "PYTHON-2", faculty: "TAT", room: "406-1" },
            { subject: "FSD-2", faculty: "PSP", room: "406-3" },
            { subject: "TOC", faculty: "DPS", room: "404" },
            { subject: "DM", faculty: "MSS", room: "405" },
            { subject: "FSD-2", faculty: "NAS", room: "407" },
            { subject: "COA", faculty: "VBY", room: "409" },
            { subject: "FSD-2", faculty: "MJT", room: "406-4" },
          ],
        },
        {
          time: "09:45 to 10:45",
          classes: [
            { subject: "DM", faculty: "MSS", room: "403" },
            { subject: "COA", faculty: "SSD", room: "404" },
            { subject: "COA", faculty: "VBY", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "TOC", faculty: "PDO", room: "409" },
          ],
        },
        {
          time: "BREAK",
          classes: Array(8).fill({ subject: "break", faculty: "", room: "" }),
        },
        {
          time: "11:30 to 12:30",
          classes: [
            { subject: "PYTHON-2", faculty: "VHA", room: "406-1" },
            { subject: "COA", faculty: "SSD", room: "403" },
            { subject: "COA", faculty: "VBY", room: "404" },
            { subject: "FSD-2", faculty: "NAS", room: "406-3" },
            { subject: "FSD-2", faculty: "PSP", room: "407" },
            { subject: "TOC", faculty: "DPS", room: "405" },
            { subject: "PYTHON-2", faculty: "DVP", room: "406-4" },
            { subject: "DM", faculty: "DDP", room: "409" },
          ],
        },
        {
          time: "12:30 to 01:30",
          classes: [
            { subject: "DM", faculty: "DDP", room: "403" },
            { subject: "DM", faculty: "BNS", room: "404" },
            { subject: "DM", faculty: "FRT", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "TOC", faculty: "DPS", room: "409" },
          ],
        },
        {
          time: "01:45 to 02:45",
          classes: [
            { subject: "COA", faculty: "VBY", room: "403" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "DM", faculty: "DDP", room: "404" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
          ],
        },
      ],
    },
    {
      day: "WED",
      slots: [
        {
          time: "08:45 to 09:45",
          classes: [
            { subject: "COA", faculty: "VBY", room: "403" },
            { subject: "PYTHON-2", faculty: "TAT", room: "406-1" },
            { subject: "DM", faculty: "BNS", room: "404" },
            { subject: "FSD-2", faculty: "NAS", room: "406-3" },
            { subject: "DM", faculty: "MSS", room: "405" },
            { subject: "PYTHON-2", faculty: "VHA", room: "407" },
            { subject: "FSD-2", faculty: "PBZ", room: "406-4" },
            { subject: "COA", faculty: "SSD", room: "409" },
          ],
        },
        {
          time: "09:45 to 10:45",
          classes: [
            { subject: "DM", faculty: "MSS", room: "403" },
            { subject: "COA", faculty: "VBY", room: "404" },
            { subject: "TOC", faculty: "PDO", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "DM", faculty: "DDP", room: "409" },
          ],
        },
        {
          time: "BREAK",
          classes: Array(8).fill({ subject: "break", faculty: "", room: "" }),
        },
        {
          time: "11:30 to 12:30",
          classes: [
            { subject: "FSD-2", faculty: "PSP", room: "406-1" },
            { subject: "COA", faculty: "SSD", room: "403" },
            { subject: "PYTHON-2", faculty: "VHA", room: "406-3" },
            { subject: "DM", faculty: "DDP", room: "404" },
            { subject: "PYTHON-2", faculty: "DVP", room: "407" },
            { subject: "TOC", faculty: "DPS", room: "405" },
            { subject: "DM", faculty: "MSS", room: "409" },
            { subject: "FSD-2", faculty: "MJT", room: "406-4" },
          ],
        },
        {
          time: "12:30 to 01:30",
          classes: [
            { subject: "TOC", faculty: "DPS", room: "403" },
            { subject: "COA", faculty: "SSD", room: "404" },
            { subject: "DM", faculty: "FRT", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "TOC", faculty: "PDO", room: "409" },
          ],
        },
        {
          time: "01:45 to 02:45",
          classes: [
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "TOC", faculty: "PDO", room: "404" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "COA", faculty: "SSD", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "COA", faculty: "VBY", room: "409" },
          ],
        },
      ],
    },
    {
      day: "THU",
      slots: [
        {
          time: "08:45 to 09:45",
          classes: [
            { subject: "DM", faculty: "MSS", room: "403" },
            { subject: "FSD-2", faculty: "NAS", room: "406-1" },
            { subject: "COA", faculty: "VBY", room: "404" },
            { subject: "PYTHON-2", faculty: "TAT", room: "406-3" },
            { subject: "TOC", faculty: "PDO", room: "405" },
            { subject: "PYTHON-2", faculty: "VHA", room: "407" },
            { subject: "PYTHON-2", faculty: "DVP", room: "406-4" },
            { subject: "TOC", faculty: "DPS", room: "409" },
          ],
        },
        {
          time: "09:45 to 10:45",
          classes: [
            { subject: "TOC", faculty: "PDO", room: "403" },
            { subject: "DM", faculty: "BNS", room: "404" },
            { subject: "COA", faculty: "VBY", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "COA", faculty: "SSD", room: "409" },
          ],
        },
        {
          time: "BREAK",
          classes: Array(8).fill({ subject: "break", faculty: "", room: "" }),
        },
        {
          time: "11:30 to 12:30",
          classes: [
            { subject: "PYTHON-2", faculty: "VHA", room: "406-1" },
            { subject: "TOC", faculty: "DPS", room: "403" },
            { subject: "FSD-2", faculty: "PSP", room: "406-3" },
            { subject: "COA", faculty: "SSD", room: "404" },
            { subject: "PYTHON-2", faculty: "DVP", room: "407" },
            { subject: "DM", faculty: "FRT", room: "405" },
            { subject: "COA", faculty: "VBY", room: "409" },
            { subject: "PYTHON-2", faculty: "TAT", room: "406-4" },
          ],
        },
        {
          time: "12:30 to 01:30",
          classes: [
            { subject: "COA", faculty: "SSD", room: "403" },
            { subject: "DM", faculty: "DDP", room: "404" },
            { subject: "TOC", faculty: "DPS", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "TOC", faculty: "PDO", room: "409" },
          ],
        },
        {
          time: "01:45 to 02:45",
          classes: [
            { subject: "none", faculty: "", room: "" },
            { subject: "DM", faculty: "DDP", room: "403" },
            { subject: "none", faculty: "", room: "" },
            { subject: "TOC", faculty: "DPS", room: "404" },
            { subject: "none", faculty: "", room: "" },
            { subject: "COA", faculty: "SSD", room: "405" },
            { subject: "DM", faculty: "MSS", room: "409" },
            { subject: "none", faculty: "", room: "" },
          ],
        },
      ],
    },
    {
      day: "FRI",
      slots: [
        {
          time: "08:45 to 09:45",
          classes: [
            { subject: "DM", faculty: "MSS", room: "403" },
            { subject: "PYTHON-2", faculty: "TAT", room: "406-1" },
            { subject: "PYTHON-2", faculty: "VHA", room: "406-3" },
            { subject: "TOC", faculty: "DPS", room: "404" },
            { subject: "FSD-2", faculty: "PSP", room: "407" },
            { subject: "COA", faculty: "SSD", room: "405" },
            { subject: "COA", faculty: "VBY", room: "409" },
            { subject: "FSD-2", faculty: "MJT", room: "406-4" },
          ],
        },
        {
          time: "09:45 to 10:45",
          classes: [
            { subject: "COA", faculty: "VBY", room: "403" },
            { subject: "DM", faculty: "DDP", room: "404" },
            { subject: "DM", faculty: "FRT", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "DM", faculty: "MSS", room: "409" },
          ],
        },
        {
          time: "BREAK",
          classes: Array(8).fill({ subject: "break", faculty: "", room: "" }),
        },
        {
          time: "11:30 to 12:30",
          classes: [
            { subject: "FSD-2", faculty: "PSP", room: "406-1" },
            { subject: "COA", faculty: "SSD", room: "403" },
            { subject: "TOC", faculty: "PDO", room: "404" },
            { subject: "PYTHON-2", faculty: "TAT", room: "406-3" },
            { subject: "COA", faculty: "VBY", room: "405" },
            { subject: "FSD-2", faculty: "NAS", room: "407" },
            { subject: "PYTHON-2", faculty: "DVP", room: "406-4" },
            { subject: "DM", faculty: "DDP", room: "409" },
          ],
        },
        {
          time: "12:30 to 01:30",
          classes: [
            { subject: "DM", faculty: "DDP", room: "403" },
            { subject: "COA", faculty: "VBY", room: "404" },
            { subject: "TOC", faculty: "PDO", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "COA", faculty: "SSD", room: "409" },
          ],
        },
        {
          time: "01:45 to 02:45",
          classes: [
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "DM", faculty: "MSS", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "TOC", faculty: "DPS", room: "409" },
          ],
        },
      ],
    },
    {
      day: "SAT",
      slots: [
        {
          time: "08:45 to 09:45",
          classes: [
            { subject: "FSD-2", faculty: "PSP", room: "406-1" },
            { subject: "DM", faculty: "DDP", room: "403" },
            { subject: "TOC", faculty: "PDO", room: "404" },
            { subject: "FSD-2", faculty: "NAS", room: "406-3" },
            { subject: "PYTHON-2", faculty: "DVP", room: "407" },
            { subject: "TOC", faculty: "DPS", room: "405" },
            { subject: "DM", faculty: "MSS", room: "409" },
            { subject: "PYTHON-2", faculty: "TAT", room: "406-4" },
          ],
        },
        {
          time: "09:45 to 10:45",
          classes: [
            { subject: "TOC", faculty: "DPS", room: "403" },
            { subject: "COA", faculty: "VBY", room: "404" },
            { subject: "COA", faculty: "SSD", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "TOC", faculty: "PDO", room: "409" },
          ],
        },
        {
          time: "11:30 to 12:30",
          classes: [
            { subject: "TOC", faculty: "PDO", room: "403" },
            { subject: "FSD-2", faculty: "NAS", room: "406-1" },
            { subject: "FSD-2", faculty: "PSP", room: "406-3" },
            { subject: "COA", faculty: "SSD", room: "404" },
            { subject: "COA", faculty: "VBY", room: "405" },
            { subject: "PYTHON-2", faculty: "VHA", room: "407" },
            { subject: "FSD-2", faculty: "PBZ", room: "406-4" },
            { subject: "DM", faculty: "DDP", room: "409" },
          ],
        },
        {
          time: "12:30 to 01:30",
          classes: [
            { subject: "COA", faculty: "VBY", room: "403" },
            { subject: "DM", faculty: "DDP", room: "404" },
            { subject: "DM", faculty: "MSS", room: "405" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "COA", faculty: "SSD", room: "409" },
          ],
        },
        {
          time: "01:45 to 02:45",
          classes: [
            { subject: "DM", faculty: "MSS", room: "403" },
            { subject: "none", faculty: "", room: "" },
            { subject: "DM", faculty: "BNS", room: "404" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
            { subject: "none", faculty: "", room: "" },
          ],
        },
      ],
    },
  ])

  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const timetableRef = useRef(null)
  const [isMounted, setIsMounted] = useState(false)

  const subjects = [
    { code: "none", name: "No Class", faculty: [] },
    { code: "PYTHON-2", name: "Python Programming - 2", faculty: ["VHA", "TAT", "DVP"] },
    { code: "DM", name: "Discrete Mathematics", faculty: ["DDP", "FRT", "BNS", "MSS"] },
    { code: "TOC", name: "Theory of Computation", faculty: ["DPS", "PDO"] },
    { code: "FSD-2", name: "Full Stack Development - 2", faculty: ["MJT", "PSP", "NAS", "PBZ"] },
    { code: "COA", name: "Computer Organization and Architecture", faculty: ["VBY", "SSD"] },
  ]

  const rooms = ["403", "404", "405", "406-1", "406-3", "406-4", "407", "409"]

  const facultyDetails = {
    VHA: "Prof. Vishal Acharya",
    TAT: "Prof. Tejas Thakkar",
    DVP: "Prof. Dhruv Prajapati",
    DDP: "Prof. Dipali Parekh",
    FRT: "Prof. Falshruti Thakkar",
    BNS: "Prof. Bhargav Suthar",
    MSS: "Prof. Meet Savani",
    DPS: "Prof. Dhara Patel",
    PDO: "Prof. Parul Oza",
    MJT: "Prof. Mitesh Thakkar",
    PSP: "Prof. Priyen Patel",
    NAS: "Prof. Nidhi Seta",
    PBZ: "Prof. Pravin Zinzala",
    VBY: "Prof. Vikas Yadav",
    SSD: "Prof. Sweta Shah",
  }

  const getSubjectColor = (subject) => {
    const colors = {
      "PYTHON-2": "bg-blue-100 text-blue-800 border-blue-200",
      DM: "bg-green-100 text-green-800 border-green-200",
      TOC: "bg-purple-100 text-purple-800 border-purple-200",
      "FSD-2": "bg-orange-100 text-orange-800 border-orange-200",
      COA: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[subject] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const showToastMessage = (message) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const updateClassSlot = (dayIndex, slotIndex, batchIndex, field, value) => {
    const newTimetableData = [...timetableData]
    newTimetableData[dayIndex].slots[slotIndex].classes[batchIndex] = {
      ...newTimetableData[dayIndex].slots[slotIndex].classes[batchIndex],
      [field]: value,
    }

    if (field === "subject") {
      const selectedSubject = subjects.find((s) => s.code === value)
      if (selectedSubject && selectedSubject.faculty.length > 0) {
        newTimetableData[dayIndex].slots[slotIndex].classes[batchIndex].faculty = selectedSubject.faculty[0]
      }
      if (value === "none") {
        newTimetableData[dayIndex].slots[slotIndex].classes[batchIndex].faculty = ""
        newTimetableData[dayIndex].slots[slotIndex].classes[batchIndex].room = ""
      }
    }

    setTimetableData(newTimetableData)
  }

  const handleSubmit = () => {
    console.log("Timetable Data:", JSON.stringify(timetableData, null, 2))
    showToastMessage("Timetable saved successfully!")
  }

  const resetTimetable = () => {
    const resetData = timetableData.map((day) => ({
      ...day,
      slots: day.slots.map((slot) => ({
        ...slot,
        classes: slot.classes.map(() => ({ subject: "none", faculty: "", room: "" })),
      })),
    }))
    setTimetableData(resetData)
    showToastMessage("Timetable reset successfully!")
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const downloadPDF = async () => {
    if (!isMounted) {
      showToastMessage("Component not fully loaded. Please try again.")
      return
    }

    const timetableElement = timetableRef.current
    if (!timetableElement) {
      showToastMessage("Timetable element not found.")
      console.error("Timetable ref is null")
      return
    }

    showToastMessage("Generating PDF...")

    try {
      // Add a slight delay to ensure DOM is fully rendered
      await new Promise((resolve) => setTimeout(resolve, 100))

      const canvas = await html2canvas(timetableElement, {
        scale: 1, // Reduced scale for performance
        useCORS: true,
        logging: true, // Enable logging for debugging
        windowWidth: timetableElement.scrollWidth,
        windowHeight: timetableElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        allowTaint: true, // Allow rendering of cross-origin content
      })

      const imgData = canvas.toDataURL("image/png", 1.0)
      if (!imgData || imgData === "data:,") {
        throw new Error("Invalid image data generated by html2canvas")
      }

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - 20) / imgHeight)
      const scaledWidth = imgWidth * ratio
      const scaledHeight = imgHeight * ratio

      pdf.addImage(imgData, "PNG", 10, 10, scaledWidth, scaledHeight)
      pdf.save("LJ_University_Timetable.pdf")
      showToastMessage("PDF downloaded successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error.message, error.stack)
      showToastMessage(`Failed to generate PDF: ${error.message}`)
    }
  }

  const getDayRowSpan = (daySlots) => daySlots.length

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <div className="w-1/6 flex-shrink-0">
        <Sidebar />
      </div>

      <div className="w-5/6 flex-grow p-4 overflow-auto mt-16">
        <div className="max-w-full mx-auto space-y-6">
          {showToast && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300">
              {toastMessage}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">L. J. Institute of Engineering & Technology</h1>
              <p className="text-lg text-gray-700 mb-1">CE/IT-II Department</p>
              <p className="text-md text-gray-600">SEM - IV TIMETABLE (W.E.F. 10th JUNE 2025 TO 18th JULY 2025)</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={downloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Download PDF
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Save Timetable
            </button>
            <button
              onClick={resetTimetable}
              className="border border-red-300 text-red-600 hover:bg-red-50 font-medium px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Reset All
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md" ref={timetableRef}>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Weekly Schedule Editor</h2>
              <p className="text-sm text-gray-600 mb-4">
                Select subjects, faculty, and rooms for each batch and time slot
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left font-semibold min-w-16">DAY</th>
                      <th className="border border-gray-300 p-2 text-left font-semibold min-w-32">Class Name</th>
                      {Array.from({ length: 8 }, (_, i) => (
                        <th key={i} className="border border-gray-300 p-2 text-center font-semibold min-w-40">
                          Batch B{i + 1}
                        </th>
                      ))}
                      <th className="border border-gray-300 p-2 text-center font-semibold min-w-32">Timings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetableData.map((day, dayIndex) =>
                      day.slots.map((slot, slotIndex) => (
                        <tr key={`${day.day}-${slotIndex}`}>
                          {slotIndex === 0 && (
                            <td
                              rowSpan={getDayRowSpan(day.slots)}
                              className="border border-gray-300 p-2 font-bold bg-blue-50 text-center align-top text-lg"
                            >
                              {day.day}
                            </td>
                          )}

                          <td className="border border-gray-300 p-2 text-sm font-medium bg-gray-50">
                            {slot.time === "BREAK" ? (
                              <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-center font-semibold">
                                BREAK
                              </div>
                            ) : (
                              slot.time
                            )}
                          </td>

                          {slot.time === "BREAK" ? (
                            <td colSpan={8} className="border border-gray-300 p-2 text-center bg-yellow-50"></td>
                          ) : (
                            slot.classes.map((classSlot, batchIndex) => (
                              <td key={batchIndex} className="border border-gray-300 p-1">
                                <div className="space-y-1">
                                  <select
                                    value={classSlot.subject}
                                    onChange={(e) =>
                                      updateClassSlot(dayIndex, slotIndex, batchIndex, "subject", e.target.value)
                                    }
                                    className="w-full h-7 text-xs border border-gray-300 rounded px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  >
                                    {subjects.map((subject) => (
                                      <option key={subject.code} value={subject.code}>
                                        {subject.code === "none" ? "No Class" : `${subject.code} - ${subject.name}`}
                                      </option>
                                    ))}
                                  </select>

                                  {classSlot.subject && classSlot.subject !== "none" && (
                                    <select
                                      value={classSlot.faculty}
                                      onChange={(e) =>
                                        updateClassSlot(dayIndex, slotIndex, batchIndex, "faculty", e.target.value)
                                      }
                                      className="w-full h-7 text-xs border border-gray-300 rounded px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                      <option value="">Select Faculty</option>
                                      {subjects
                                        .find((s) => s.code === classSlot.subject)
                                        ?.faculty.map((faculty) => (
                                          <option key={faculty} value={faculty}>
                                            {faculty}
                                          </option>
                                        ))}
                                    </select>
                                  )}

                                  {classSlot.subject && classSlot.subject !== "none" && (
                                    <select
                                      value={classSlot.room}
                                      onChange={(e) =>
                                        updateClassSlot(dayIndex, slotIndex, batchIndex, "room", e.target.value)
                                      }
                                      className="w-full h-7 text-xs border border-gray-300 rounded px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                      <option value="">Select Room</option>
                                      {rooms.map((room) => (
                                        <option key={room} value={room}>
                                          {room}
                                        </option>
                                      ))}
                                    </select>
                                  )}

                                  {classSlot.subject && classSlot.subject !== "none" && (
                                    <div className="mt-1">
                                      <span
                                        className={`inline-block text-xs px-2 py-1 rounded-box border ${getSubjectColor(classSlot.subject)}`}
                                      >
                                        {classSlot.subject} ({classSlot.faculty})
                                      </span>
                                      {classSlot.room && (
                                        <div className="text-xs text-gray-500 mt-1">{classSlot.room}</div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>
                            ))
                          )}

                          <td className="border border-gray-300 p-2 text-xs text-center bg-gray-50">
                            {slot.time === "BREAK" ? "" : slot.time}
                          </td>
                        </tr>
                      )),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Sem IV Subject & Faculty Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Full Stack Development with JavaScript - 2 (FSD-2)</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Prof. Mitesh Thakkar (MJT)</p>
                      <p>Prof. Priyen Patel (PSP)</p>
                      <p>Prof. Nidhi Seta (NAS)</p>
                      <p>Prof. Pravin Zinzala (PBZ)</p>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Computer Organization and Architecture (COA)</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Prof. Vikas Yadav (VBY)</p>
                      <p>Prof. Sweta Shah (SSD)</p>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Fundamentals of Computer Science using Python-2 (Python-2)</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Prof. Vishal Acharya (VHA)</p>
                      <p>Prof. Tejas Thakkar (TAT)</p>
                      <p>Prof. Dhruv Prajapati (DVP)</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Theory of Computation (TOC)</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Prof. Dhara Patel (DPS)</p>
                      <p>Prof. Parul Oza (PDO)</p>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Discrete Mathematics (DM)</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Prof. Dipali Parekh (DDP)</p>
                      <p>Prof. Falshruti Thakkar (FRT)</p>
                      <p>Prof. Bhargav Suthar (BNS)</p>
                      <p>Prof. Meet Savani (MSS)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div>
                  <p>
                    <strong>Prepared By:</strong> Prof. Parul Oza, Prof. Dhara Patel
                  </p>
                </div>
                <div className="text-right">
                  <p>Prof. Mitesh Thakkar</p>
                  <p>HOD (SY CE/IT-2)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}