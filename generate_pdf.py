from fpdf import FPDF
import os

class PDF(FPDF):
    def header(self):
        self.set_font("helvetica", "B", 15)
        self.cell(0, 10, "Complete Troubleshooting & Diagnostic Log", align="C", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 10, "Razer Blade Stealth 13 (RZ09-02810E71)", align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(10)

pdf = PDF()
pdf.add_page()
pdf.set_font("helvetica", "B", 12)

# Background
pdf.cell(0, 10, "Background", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("helvetica", size=11)
pdf.multi_cell(0, 5, "I replaced the original swollen battery after the laptop had been dead for several years. The objective was to determine whether the failure was limited to the battery or if the motherboard had also been damaged.")
pdf.ln(5)

# Step 1
pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 10, "Step 1 - Battery Replacement", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("helvetica", size=11)
pdf.multi_cell(0, 5, "Installed a brand-new RC30-0281 battery. Verified the connector orientation and fully seated the battery connector. Pressing the power button produced no fan spin, LEDs, keyboard backlight, or display.")
pdf.ln(5)

# Step 2
pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 10, "Step 2 - Charger Verification", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("helvetica", size=11)
pdf.multi_cell(0, 5, "Verified the USB-C PD charger was a 100 W model capable of supplying 20 V. This ruled out using an underpowered adapter.")
pdf.ln(2)
pdf.image("public/assets/dossier/documentation/razer-battery-replacement-VRM-diagnostics/page_1_image_1.png", w=150)
pdf.ln(5)

pdf.add_page()
# Step 3
pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 10, "Step 3 - Internal Inspection", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("helvetica", size=11)
pdf.multi_cell(0, 5, "Removed the bottom cover and identified the battery connector, USB-C charging circuitry, embedded controller (ITE IT8390E-256), VRM components, inductors marked R010 and 1R5, heatsink assembly, and the NVMe SSD.")
pdf.ln(2)
pdf.image("public/assets/dossier/documentation/razer-battery-replacement-VRM-diagnostics/page_2_image_1.jpeg", w=150)
pdf.ln(5)

# Step 4
pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 10, "Step 4 - Continuity / Ground Checks", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("helvetica", size=11)
pdf.multi_cell(0, 5, "Confirmed chassis ground using screw holes and USB-C shield. This established reliable reference points for voltage measurements.")
pdf.ln(5)

pdf.add_page()
# Step 5
pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 10, "Step 5 - Battery Rail Measurements", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("helvetica", size=11)
pdf.multi_cell(0, 5, "Measured approximately 11.73 V on the battery power rail at the R010 current-sense resistors. This confirmed the replacement battery was actually delivering voltage into the motherboard.")
pdf.ln(2)
pdf.image("public/assets/dossier/documentation/razer-battery-replacement-VRM-diagnostics/page_3_image_1.png", w=150)
pdf.ln(5)

# Step 6
pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 10, "Step 6 - USB-C Input Measurements", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("helvetica", size=11)
pdf.multi_cell(0, 5, "Measured approximately 19 V on the USB-C power input, confirming successful USB-C Power Delivery negotiation and that charger voltage reached the motherboard.")
pdf.ln(2)
pdf.image("public/assets/dossier/documentation/razer-battery-replacement-VRM-diagnostics/page_3_image_2.png", w=150)
pdf.ln(5)

pdf.add_page()
# Step 7
pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 10, "Step 7 - Power Rail Investigation", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("helvetica", size=11)
pdf.multi_cell(0, 5, "Probed downstream VRM components around the 1R5 inductors. Readings fluctuated between roughly 2.5 V, 4.4 V, and higher values before collapsing back to 0 V. These unstable readings indicate the power-management circuitry repeatedly attempted to start before shutting itself down.")
pdf.ln(2)
pdf.image("public/assets/dossier/documentation/razer-battery-replacement-VRM-diagnostics/page_4_image_1.jpeg", w=80)
pdf.ln(2)
pdf.image("public/assets/dossier/documentation/razer-battery-replacement-VRM-diagnostics/page_4_image_2.jpeg", w=80)
pdf.ln(5)

# Step 8
pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 10, "Step 8 - Embedded Controller", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("helvetica", size=11)
pdf.multi_cell(0, 5, "Measured around the ITE embedded controller. No obvious operating voltage was found on accessible pins, although probing the fine-pitch pins was limited to avoid accidental shorts.")
pdf.ln(5)

# Step 9
pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 10, "Step 9 - Thermal Findings", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("helvetica", size=11)
pdf.multi_cell(0, 5, "The 4R39/02CAB power component became noticeably warm while the system remained completely dead. Heat generation confirms current flow into at least part of the VRM/power stage.")
pdf.ln(2)
pdf.image("public/assets/dossier/documentation/razer-battery-replacement-VRM-diagnostics/page_4_image_3.jpeg", w=150)
pdf.ln(5)

pdf.add_page()
# Step 10
pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 10, "Step 10 - SSD Identification", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("helvetica", size=11)
pdf.multi_cell(0, 5, "Identified the internal storage as an M.2 NVMe SSD. This drive can be removed and installed in an external USB enclosure to recover files if the motherboard is beyond repair.")
pdf.ln(2)
pdf.image("public/assets/dossier/documentation/razer-battery-replacement-VRM-diagnostics/page_5_image_1.jpeg", w=150)
pdf.ln(5)

# Assessment
pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 10, "Assessment", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("helvetica", size=11)
pdf.multi_cell(0, 5, "The evidence collected tells me that I don't have a failed battery or charger. Battery voltage reaches the motherboard, USB-C negotiates correctly, and portions of the power show voltages. The unstable VRM outputs together with the warm power stage strongly suggest a motherboard-level failure involving the power-management circuitry, or a shorted downstream rail. I realize that the swollen battery could have caused this from the bulging it created while it was swollen.")
pdf.ln(5)

# Skills Demonstrated
pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 10, "Skills Demonstrated", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("helvetica", size=11)
pdf.multi_cell(0, 5, "- Safe laptop disassembly\n- Battery replacement\n- Connector identification\n- Multimeter use\n- DC voltage tracing\n- USB-C verification\n- VRM troubleshooting\n- Power rail analysis\n- Component identification\n- NVMe SSD removal planning")

pdf.output("public/assets/dossier/documentation/razer-battery-replacement-VRM-diagnostics/PORTFOLIO Razer_Blade_Stealth_Full_Troubleshooting_Log.pdf")
print("PDF regenerated!")
