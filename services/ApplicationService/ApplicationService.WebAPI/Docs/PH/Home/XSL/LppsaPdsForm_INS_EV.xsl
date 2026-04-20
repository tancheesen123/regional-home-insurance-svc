<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<html>
			<meta charset="UTF-8" />
			<style></style>

			<body>
				<div style="padding-left: 40px; padding-right: 40px">
					<div style="height: 30px"></div>
					<div style="height: 145px">
						<table>
							<tr style="height: 0.2px"></tr>
						</table>
						<img height="140px" style="float: right">
							<xsl:attribute name="src">
								<xsl:value-of select="root/ImageEgibEnHeader" />
							</xsl:attribute>
						</img>
					</div>
					<table
					  cellpadding="0"
					  cellspacing="0"
					  border="0"
					  style="empty-cells: show; width: 100%; border-collapse: collapse"
          >
						<tr>
							<td
							  width="50%"
							  style="
                  pointer-events: auto;
                  background-color: #ffc000;
                  border: 1px solid #171710;
                  padding: 10px;
                  text-align: justify;
                "
              >
								<b
								  style="
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 16px;
                    line-height: 1.1499023;
                  "
                  >PRODUCT DISCLOSURE SHEET</b
                >
							</td>
							<td
							  width="50%"
							  style="
                  pointer-events: auto;
                  background-color: #ffc000;
                  border: 1px solid #171710;
                  padding: 10px;
                  text-align: justify;
                "
              >
								<b
								  style="
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 16px;
                    line-height: 1.1499023;
                  "
                  >Etiqa General Insurance Berhad ("We/Us/Our")</b
                >
							</td>
						</tr>
						<tr>
							<td
							  style="
                  pointer-events: auto;
                  text-indent: 0px;
                  border: 1px solid #171710;
                  padding: 10px;
                  padding-bottom: 27px;
                  text-align: justify;
                  font-family: Arial, Helvetica, sans-serif;
                  font-size: 14px;
                  line-height: 1.1499023;
                "
              >
								Read this Product Disclosure Sheet before you decide to
								participate the
								<b>Householder Insurance</b>. Be sure to also read the general
								terms and conditions
							</td>
							<td
							  style="
                  pointer-events: auto;
                  text-indent: 0px;
                  border: 1px solid #171710;
                  padding: 10px;
                  text-align: justify;
                  font-family: Arial, Helvetica, sans-serif;
                  font-size: 14px;
                  line-height: 1.1499023;
                "
              >
								<b>Householder Insurance</b>
								<br />
								<br />
								<b>
									Date: <xsl:value-of select="root/P_Date" />
								</b>
								<br />
								<br />
							</td>
						</tr>
					</table>
				</div>
				<div
				  style="
            padding-left: 40px;
            padding-right: 40px;
            text-align: justify;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.1499023;
          "
        >
					<p style="margin-block-end: 0px; font-size: 14px">
						<b>
							<span style="padding-right: 5px">1.</span> What is this product
							about?
						</b>
						<br />
						<td>
							<p
							  style="
                  margin-block-start: 0px;
                  font-size: 14px;
                  padding-left: 20px;
                "
              >
								This product provides you with coverage for your building
								(private dwelling) and household contents as well as personal
								effects inside your house.
							</p>
						</td>
					</p>

					<p style="margin-block-end: 0px; font-size: 14px">
						<b>
							<span style="padding-right: 5px">2.</span> What are the
							covers/benefits provided?
						</b>
					</p>
					<span style="font-size: 14px; padding-left: 20px"
            >The coverages/benefit are summarized below:</span
          >
					<br />
					<div style="padding-left: 20px; margin-bottom: 5px">
						<table
						  cellpadding="0"
						  cellspacing="0"
						  border="0"
						  style="empty-cells: show; width: 100%; border-collapse: collapse"
            >
							<tr>
								<td
								  width="70%"
								  style="
                    pointer-events: auto;
                    background-color: #ffc000;
                    border: 1px solid #171710;
                    text-align: center;
                  "
                >
									<b
									  style="
                      font-family: Arial, Helvetica, sans-serif;
                      font-size: 16px;
                      line-height: 1.1499023;
                    "
                    >Benefit Type</b
                  >
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Fire, Lightning, and Explosion caused by gas used for domestic
									purposes
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Aircraft and aerial devices or articles dropped therefrom
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Impact damage by road vehicles or animals
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Bursting or overflowing of water tanks, apparatus or pipes
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Theft by actual forcible and violent breaking into and out of
									the house
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Hurricane, Cyclone, Typhoon, Windstorm
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Earthquake or Volcanic Eruption
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Flood
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Loss of Rent - Limit 10% of Total Sum Insured
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Liability to the third parties for accidents in your house –
									Limit of Liability up to RM50,000
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Contents temporarily removed from the house – Limit 15% of
									total sum insured on contents
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Damage to mirrors, other than hand mirrors – Limit RM500 per
									piece any one accident
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Compensation on Death of the Insured; due to fire or robbery
									where there is violent and forcible entry to the house – Limit
									RM10,000 or one-half of the Sum Insured on contents whichever
									is lower
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Domestic helper’s property
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Riot, Strike and Malicious Damage
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Subsidence and landslip
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Damage by falling trees or branches and objects
								</td>
							</tr>
						</table>
					</div>
					<p
					  style="
              margin-block-start: 0px;
              margin-block-end: 5px;
              font-size: 14px;
              padding-left: 20px;
              padding-top: 10px;
            "
          >
						You may further extend coverage by paying additional premium:
					</p>
					<div style="padding-left: 20px">
						<table
						  cellpadding="0"
						  cellspacing="0"
						  border="0"
						  style="empty-cells: show; width: 100%; border-collapse: collapse"
            >
							<tr>
								<td
								  width="70%"
								  style="
                    pointer-events: auto;
                    background-color: #ffc000;
                    border: 1px solid #171710;
                    text-align: center;
                  "
                >
									<b
									  style="
                      font-family: Arial, Helvetica, sans-serif;
                      font-size: 16px;
                      line-height: 1.1499023;
                    "
                    >Benefit Type</b
                  >
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Increase Limit of Liability to the public up to a maximum
									limit of RM250,000
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Increase limit for loss of rent
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Unoccupancy in excess of ninety (90) days
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Theft without actual forcible and violent breaking into and/or
									out excluding theft by domestic servants or member of
									family/household
								</td>
							</tr>
						</table>
					</div>
					<p
					  style="
              margin-block-start: 0px;
              margin-block-end: 5px;
              font-size: 14px;
              padding-left: 20px;
              padding-top: 10px;
            "
          >
						Duration of cover is for one year. You need to renew your policy
						contract annually.
					</p>
					<p
					  style="
              margin-block-start: 0px;
              margin-block-end: 5px;
              font-size: 14px;
              padding-left: 20px;
            "
          >
						<b>Note:</b> Please refer to the policy contract for further details
						of the above benefits.
					</p>
					<p style="margin-block-end: 0px; font-size: 14px">
						<b>
							<span style="padding-right: 5px">3.</span> How much premium do I
							have to pay?
						</b>
					</p>
					<p
					  style="
              margin-block-start: 0px;
              margin-block-end: 8px;
              font-size: 14px;
              padding-left: 20px;
            "
          >
						The insurance premium that you have to pay annually is calculated
						based on your sum insured and selected additional perils, if any.
					</p>
					<div style="padding-left: 20px">
						<table
						  cellpadding="0"
						  cellspacing="0"
						  border="0"
						  style="
                empty-cells: show;
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
              "
            >
							<tr style="font-size: 14px">
								<th
								  rowspan="2"
								  style="
                    pointer-events: auto;
                    background-color: #ffc000;
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									Plan
								</th>
								<th
								  rowspan="2"
								  style="
                    pointer-events: auto;
                    background-color: #ffc000;
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									Sum Insured (RM)
								</th>
								<th
								  colspan="3"
								  style="
                    pointer-events: auto;
                    background-color: #ffc000;
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									Basic Premium by Construction Class (RM)
								</th>
							</tr>
							<tr
							  style="
                  border: 1px solid #171710;
                  text-align: center;
                  padding: 2px 10px;
                "
              >
								<th
								  style="
                    pointer-events: auto;
                    background-color: #ffc000;
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									Class 1A
								</th>
								<th
								  style="
                    pointer-events: auto;
                    background-color: #ffc000;
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									Class 1B
								</th>
								<th
								  style="
                    pointer-events: auto;
                    background-color: #ffc000;
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									Class 2
								</th>
							</tr>
							<tr
							  style="
                  border: 1px solid #171710;
                  text-align: center;
                  padding: 2px 10px;
                "
              >
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									A
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									20,000
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									87.80
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									124.20
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									150.20
								</td>
							</tr>
							<tr
							  style="
                  border: 1px solid #171710;
                  text-align: center;
                  padding: 2px 10px;
                "
              >
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									B
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									30,000
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									131.70
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									186.30
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									225.30
								</td>
							</tr>
							<tr
							  style="
                  border: 1px solid #171710;
                  text-align: center;
                  font-size: 14px;
                "
              >
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									C
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									30,001 up to 200,000
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
								  colspan="3"
                >
									Based on Sum Insured
								</td>
							</tr>
						</table>
					</div>
					<p
					  style="
              margin-block-start: 0px;
              margin-block-end: 8px;
              font-size: 14px;
              padding-left: 20px;
            "
          >
						All premiums (if applicable) will be subjected to relevant charges
						or taxes, as deemed necessary by the Malaysia tax authorities. It is
						important to keep any receipt that you receive as proof of payment
						of premiums.
					</p>

					<div
					  style="
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              line-height: 1.1499023;
            "
          >
						<p style="margin-block-end: 0px; font-size: 14px">
							<b>
								<span style="padding-right: 5px">4.</span> What are the fees and
								charges that I have to pay?
							</b>
						</p>
						<div style="padding-left: 20px">
							<table
							  cellpadding="0"
							  cellspacing="0"
							  border="0"
							  style="font-size: 14px; width: 65%; border-collapse: collapse"
              >
								<tr>
									<td
									  width="50%"
									  style="
                      pointer-events: auto;
                      background-color: #ffc000;
                      text-align: center;
                      border: 1px solid #171710;
                      font-size: 14px;
                    "
                  >
										<b>Type</b>
									</td>
									<td
									  width="50%"
									  style="
                      pointer-events: auto;
                      background-color: #ffc000;
                      text-align: center;
                      border: 1px solid #171710;
                      font-size: 14px;
                    "
                  >
										<b>Amount</b>
									</td>
								</tr>

								<tr>
									<td
									  style="
                      pointer-events: auto;
                      text-indent: 0px;
                      border: 1px solid #171710;
                      padding: 2px 10px;
                    "
                  >
										Services Tax
									</td>
									<td
									  style="
                      pointer-events: auto;
                      text-indent: 0px;
                      border: 1px solid #171710;
                      padding: 2px 10px;
                      text-align: center;
                    "
                  >
										8% of the premium
									</td>
								</tr>

								<tr>
									<td
									  style="
                      pointer-events: auto;
                      text-indent: 0px;
                      border: 1px solid #171710;
                      padding: 2px 10px;
                    "
                  >
										Stamp duty
									</td>
									<td
									  style="
                      pointer-events: auto;
                      text-indent: 0px;
                      border: 1px solid #171710;
                      padding: 2px 10px;
                      text-align: center;
                    "
                  >
										RM10.00
									</td>
								</tr>
							</table>
						</div>
					</div>

					<div>
						<table>
							<tr style="height: 80px"></tr>
						</table>
						<table
						  style="empty-cells: show; width: 100%; border-collapse: collapse"
            >
							<tr>
								<td width="50%"></td>
								<td width="50%">
									<div
									  style="
                      display: flex;
                      justify-content: space-between;
                      font-size: 14px;
                    "
                  >
										<p style="text-align: left">1</p>
										<p style="text-align: right">
											PMG/EGIB/HH (LPPSA)/PDS/ENG/2304V1.0
										</p>
									</div>
								</td>
							</tr>
						</table>
					</div>
				</div>

				<div style="page-break-after: always"></div>
				<div style="height: 30px"></div>
				<div
				  style="
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.1499023;
          "
        >
					<div
					  style="
              padding-left: 40px;
              padding-right: 40px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              line-height: 1.1499023;
            "
          >
						<p
						  style="margin-block-end: 0px; font-size: 14px; padding-top: 30px"
            >
							<b>
								<span style="padding-right: 5px">5.</span> What are some of the
								key terms and conditions that I should be aware of?
							</b>
						</p>
						<span style="padding-left: 20px; font-size: 14px">
							<b>Importance of Disclosure</b>
						</span>
						<ol
						  type="a"
						  style="
                margin-block-start: 2px;
                padding-inline-start: 37px;
                margin-block-end: 8px;
                font-size: 14px;
              "
            >
							<li>
								Pursuant to Paragraph 5 of Schedule 9 of the Financial Services
								Act 2013, if you are applying for this Insurance wholly for
								purposes unrelated to your trade, business or profession, you
								have a duty to take reasonable care not to make a
								misrepresentation in answering the questions in the Application
								Form (or when you apply for this insurance). You must answer the
								questions fully and accurately.
							</li>
							<li>
								Failure to take reasonable care in answering the questions may
								result in avoidance of your contract of Insurance, refusal or
								reduction of your claim(s), change of terms or termination of
								your contract of Insurance
							</li>
							<li>
								The above duty of disclosure shall continue until the time your
								contract of Insurance is entered into, varied or renewed with
								us.
							</li>
							<li>
								In addition in answering the questions in the Application Form
								(or when you apply for this Insurance), you are required to
								disclose any other matter that you know to be relevant to our
								decision in accepting the risks and determining the rates and
								terms to be applied
							</li>
							<li>
								You also have a duty to tell us immediately if at any time after
								your contract of Insurance has been entered into, varied or
								renewed with us any of the information given in the Application
								Form (or when you applied for this Insurance) is inaccurate or
								has changed.
							</li>
						</ol>

						<p
						  style="
                margin-block-end: 0px;
                margin-block-start: 5px;
                padding-left: 20px;
                font-size: 14px;
              "
            >
							<b>Householder Contents</b> - No one article (excluding furniture,
							piano, organ, household appliances, radios, television sets, video
							recorder sets, hi-fi equipment and the like) shall exceed 5% of
							the total sum insured unless such article is specially declared as
							a separate item.
						</p>

						<p
						  style="
                margin-block-end: 0px;
                margin-block-start: 5px;
                padding-left: 20px;
                font-size: 14px;
              "
            >
							<b>Limited Protection</b> – The total value of platinum, gold and
							silver articles, precious metal and stones, jewelry, watches and
							furs shall be deemed not to exceed one-third (1/3) of the total
							sum insured on home contents.
						</p>
						<p
						  style="
                margin-block-end: 0px;
                margin-block-start: 5px;
                padding-left: 20px;
                font-size: 14px;
              "
            >
							<b>Full Value of Home Contents</b> – The total sum insured
							declared by you shall not less than the full value of the covered
							home contents. The total liability of the company in respect of
							loss or damage thereto during any one period of insurance shall
							not exceed the amount stated against each item respectively or in
							the aggregate the total sum insured specified in the schedule.
						</p>
						<p
						  style="
                margin-block-end: 0px;
                margin-block-start: 5px;
                padding-left: 20px;
                font-size: 14px;
              "
            >
							<b>Claims</b> – If an accident occurs which give rise to a claim,
							you must notify us within 30 days from the date of accident.
						</p>
						<p
						  style="
                margin-block-start: 0px;
                margin-block-end: 8px;
                font-size: 14px;
                padding-left: 20px;
              "
            >
							If any of your household items is of greater than 5% of the total
							sum insured; you are advised to declare these items separately.
						</p>
						<p
						  style="
                margin-block-end: 0px;
                margin-block-start: 5px;
                padding-left: 20px;
                font-size: 14px;
              "
            >
							<b>Note:</b> This list is non-exhaustive. Please refer to the
							policy contract for the full list of terms and conditions.
						</p>

						<p style="margin-block-end: 0px; font-size: 14px">
							<b>
								<span style="padding-right: 5px">6.</span> What are the major
								exclusions under this policy?
							</b>
						</p>
						<span style="padding-left: 20px; font-size: 14px">
							This policy does not cover certain losses, such as:
						</span>
						<ol
						  type="a"
						  style="
                margin-block-start: 2px;
                padding-inline-start: 35px;
                margin-block-end: 8px;
                font-size: 14px;
              "
            >
							<li>Loss or damage due to war or similar risks;</li>
							<li>
								Loss or damage due to radioactivity contamination, nuclear
								radiation or similar risks;
							</li>
							<li>If your house left vacant for more than 90 days.</li>
						</ol>

						<p
						  style="
                margin-block-end: 0px;
                margin-block-start: 5px;
                padding-left: 20px;
                font-size: 14px;
              "
            >
							<b>Note:</b>This list is non-exhaustive. Please refer to the
							policy contract for the full list of exclusions.
						</p>

						<p style="margin-block-end: 0px; font-size: 14px">
							<b>
								<span style="padding-right: 5px">7.</span> Can I cancel my
								policy?
							</b>
						</p>
						<p
						  style="
                padding-left: 20px;
                margin-block-end: 0px;
                margin-block-start: 0px;
                font-size: 14px;
              "
            >
							You may cancel your policy by giving a written notice to us. Upon
							cancellation, you are entitled to a partial refund of the premium
							provided you have not made a claim during the period of insurance.
						</p>

						<p style="margin-block-end: 0px; font-size: 14px">
							<b>
								<span style="padding-right: 5px">8.</span> What do I need to do
								if there are changes to my contact details?
							</b>
						</p>
						<p
						  style="
                padding-left: 20px;
                margin-block-end: 0px;
                margin-block-start: 0px;
                font-size: 14px;
              "
            >
							It is important that you inform us of any changes in your contact
							details to ensure that all correspondences reach you in a timely
							manner.
						</p>

						<p style="margin-block-end: 0px; font-size: 14px">
							<b>
								<span style="padding-right: 5px">9.</span> Where can I get
								further information?
							</b>
						</p>
						<div
						  style="
                padding-left: 20px;
                margin-block-end: 0px;
                margin-block-start: 0px;
                font-size: 14px;
              "
            >
							<table
							  style="
                  empty-cells: show;
                  width: 100%;
                  border-collapse: collapse;
                "
              >
								<tr>
									<td width="50%" style="vertical-align: top; padding-top: 1px">
										<div style="font-size: 14px">
											<p>If you have any enquiries, please contact us at:</p>
											<div>
												<strong
                          >Etiqa General Insurance Berhad (197001000276)</strong
                        >
											</div>
											<div>
												(Licensed under Financial Services Act 2013 and
												regulated by Bank Negara Malaysia)
											</div>
											<div>Level 13, Tower B, Dataran Maybank</div>
											<div>No. 1, Jalan Maarof</div>
											<div>59000 Kuala Lumpur, Malaysia.</div>
											<div>Telephone Number: +603 2297 3888</div>
											<div>Facsimile Number: +603 2297 3800</div>
											<div>
												E-mail:
												<a href="mailto:info@etiqa.com.my">info@etiqa.com.my</a>
											</div>
											<div>
												Homepage:
												<a href="http://www.etiqa.com.my" target="_blank"
                          >www.etiqa.com.my</a
                        >
											</div>
											<div>Etiqa Oneline: 1300 13 8888</div>
										</div>
									</td>
									<td width="50%" style="vertical-align: top">
										<div style="font-size: 14px">
											<p>Or, you may contact:</p>
											<div>LPPSA Officer</div>
											<div>Name: Zuraini Mas Ayu</div>
											<div>Email: nonmotor.gta@etiqa.com.my</div>
											<div>Telephone Number: +603 8861 6772</div>
											<div>Facsimile Number: +603 8861 6782</div>
										</div>
									</td>
								</tr>
							</table>
						</div>
						<p style="margin-block-end: 0px; font-size: 14px">
							<b>
								<span>10.</span> Other types of similar cover available
							</b>
						</p>

						<p
						  style="
                margin-block-start: 0px;
                margin-block-end: 8px;
                font-size: 14px;
                padding-left: 20px;
              "
            >
							a. Fire Insurance.
						</p>

						<div style="padding-left: 20px">
							<table width="100%">
								<td
								  style="
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-size: 14px;
                  "
                >
									<b>
										IMPORTANT NOTE: <br />
										<xsl:choose>
											<xsl:when test="root/P_IsAgency = 'true'">
												YOU MUST ENSURE THAT YOUR PROPERTY IS INSURED AT THE
												APPROPRIATE AMOUNT. YOU SHOULD READ AND UNDERSTAND THE
												POLICY CONTRACT AND CONTACT US DIRECTLY FOR MORE
												INFORMATION.
											</xsl:when>
											<xsl:when test="root/P_IsAgency = 'false'">
												YOU MUST ENSURE THAT YOUR PROPERTY IS INSURED AT THE
												APPROPRIATE AMOUNT. YOU SHOULD READ AND UNDERSTAND THE
												POLICY CONTRACT AND CONTACT US DIRECTLY FOR MORE
												INFORMATION.
											</xsl:when>
										</xsl:choose>
									</b>
								</td>
							</table>
							<p
							  style="
                  margin-block-start: 0px;
                  margin-block-end: 0px;
                  font-size: 14px;
                "
              >
								The information provided in this disclosure sheet is valid as at
								<xsl:value-of select="root/P_Date" />
							</p>
						</div>
						<div>
							<table>
								<tr style="height: 290px"></tr>
							</table>
							<table
							  style="
                  empty-cells: show;
                  width: 100%;
                  border-collapse: collapse;
                "
              >
								<tr>
									<td width="50%"></td>
									<td width="50%">
										<div
										  style="
                        display: flex;
                        justify-content: space-between;
                        font-size: 14px;
                      "
                    >
											<p style="text-align: left">2</p>
											<p style="text-align: right">
												PMG/EGIB/HH (LPPSA)/PDS/ENG/2304V1.0
											</p>
										</div>
									</td>
								</tr>
							</table>
						</div>
					</div>
				</div>
				<div style="page-break-after: always"></div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
