<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<html>

			<head>
				<title></title>
				<style>
					ol {
					margin: 0;
					padding-left: 1.2em;
					}

					ul {
					margin: 0;
					padding-left: 1.2em;
					}

					ol.custom-indent {
					list-style-position: outside;
					/* numbers outside the content block */
					padding-left: 2.5em;
					/* space for numbers + extra indent */
					margin: 0;
					}

					ol.custom-indent li {
					text-indent: -1em;
					/* pull first line back */
					padding-left: 1em;
					/* indent the content */
					margin-bottom: 0.5em;
					/* optional spacing between items */
					}

					ol.custom-alpha {
					list-style: none;
					counter-reset: item;
					padding-left: 1.5em;
					}

					ol.custom-alpha li {
					counter-increment: item;
					position: relative;
					margin-bottom: 0px;
					}

					ol.custom-alpha li::before {
					content: counter(item, lower-alpha) ") ";
					position: absolute;
					left: -1.5em;
					}

					table {
					border-collapse: separate;
					page-break-inside: auto;
					page-break-after: auto;
					width: 100%;
					}

					tr {
					page-break-inside: avoid;
					page-break-after: auto;
					}
				</style>
			</head>

			<body>
				<table border="0" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%;">
					<tr>
						<td style="height: 50px;
  vertical-align: bottom;">
							<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
								PRODUCT DISCLOSURE SHEET
							</strong>
							<br />
							<br />
							<span style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500;">
								<strong>Dear Customer,</strong>
								<br />
								This Product Disclosure Sheet (PDS) is designed to provide you with some key information on
								your <strong>Houseowner/Householder Insurance</strong>. Other customers have read this PDS
								and found it helpful, you should read this too.
							</span>

						</td>
						<td>
							<img alt="Etiqa Logo" height='160' style="text-align: center;">
								<xsl:attribute name="src">
									<xsl:value-of select="root/P_LogoImage" />
								</xsl:attribute>
							</img>
							<br />
						</td>

					</tr>
					<tr>
						<td>
						</td>
						<td style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500; text-align: center;">
							<span>
								Date: <xsl:value-of select="root/P_PaymentDate" />
							</span>
						</td>

					</tr>

				</table>


				<img alt="Number1Image" height='20'>
					<xsl:attribute name="src">
						<xsl:value-of select="root/P_Number1Image" />
					</xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px;  font-weight: 700;">
					 What is Houseowner/Householder Insurance?
				</strong>
				<br />
				<span style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500;">
					Houseowner/Householder Insurance provides coverage for your building (private dwelling) and household
					contents as well as personal effects inside your house.
				</span>
				<br />
				<br />

				<img alt="Number2Image" height='20'>
					<xsl:attribute name="src">
						<xsl:value-of select="root/P_Number2Image" />
					</xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px;  font-weight: 700;">
					 Know Your Coverages
				</strong>
				<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px;">
					<tr>
						<td>
							<span style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500;">
								For a duration of annual cover, you will receive the following insurance coverages:
							</span>
							<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: center;">
								<tr style="background-color: #FFC000;">
									<th style="width: 5%">No.</th>
									<th style="width: 65%">Benefit Type</th>
									<th style="width: 15%">
										Houseowner<br />
										(Building)
									</th>
									<th style="width: 15%">
										Householder<br/>
										(Contents)
									</th>
								</tr>
								<tr>
									<td>1.</td>
									<td style="text-align: justify;">
										Fire, Lightning, and Explosion caused by gas used for
										domestic purposes
									</td>
									<td class="covered">Covered</td>
									<td class="covered">Covered</td>
								</tr>
								<tr>
									<td>2.</td>
									<td style="text-align: justify;">
										Aircraft and aerial devices or articles dropped therefrom
									</td>
									<td class="covered">Covered</td>
									<td class="covered">Covered</td>
								</tr>
								<tr>
									<td>3.</td>
									<td style="text-align: justify;">Impact damage by road vehicles or animals</td>
									<td class="covered">Covered</td>
									<td class="covered">Covered</td>
								</tr>
								<tr>
									<td>4.</td>
									<td style="text-align: justify;">
										Bursting or overflowing of water tanks, apparatus or pipes
									</td>
									<td class="covered">Covered</td>
									<td class="covered">Covered</td>
								</tr>
								<tr>
									<td>5.</td>
									<td style="text-align: justify;">
										Theft by actual forcible and violent breaking into and out
										of the house
									</td>
									<td class="covered">Covered</td>
									<td class="covered">Covered</td>
								</tr>
								<tr>
									<td>6.</td>
									<td style="text-align: justify;">Hurricane, Cyclone, Typhoon, Windstorm</td>
									<td class="covered">Covered</td>
									<td class="covered">Covered</td>
								</tr>
								<tr>
									<td>7.</td>
									<td style="text-align: justify;">Earthquake or Volcanic Eruption</td>
									<td class="covered">Covered</td>
									<td class="covered">Covered</td>
								</tr>
								<tr>
									<td>8.</td>
									<td style="text-align: justify;">Flood</td>
									<td class="covered">Covered</td>
									<td class="covered">Covered</td>
								</tr>
								<tr>
									<td>9.</td>
									<td style="text-align: justify;">Loss of Rent - Limit 10% of Total Sum Insured</td>
									<td class="covered">Covered</td>
									<td class="covered">Covered</td>
								</tr>
								<tr>
									<td>10.</td>
									<td style="text-align: justify;">
										Liability to the third parties for accidents in your house
										&#45; Limit of Liability up to RM50,000
									</td>
									<td class="covered">Covered</td>
									<td class="covered">Covered</td>
								</tr>
								<tr>
									<td>11.</td>
									<td style="text-align: justify;">
										Contents temporarily removed from the house &#45; Limit
										15% of
										total sum insured on contents
									</td>
									<td class="not-covered">Not Covered</td>
									<td class="covered">Covered</td>
								</tr>
								<tr>
									<td>12.</td>
									<td style="text-align: justify;">
										Damage to mirrors, other than hand mirrors &#45; Limit
										RM500
										per piece any one accident
									</td>
									<td class="not-covered">Not Covered</td>
									<td class="covered">Covered</td>
								</tr>
								<tr>
									<td>13.</td>
									<td style="text-align: justify;">
										Compensation on Death of the Insured Person; due to fire
										or robbery where there is violent and forcible entry to the house &#45; Limit
										RM10,000
										or one-half of the Sum Insured on contents whichever is lower
									</td>
									<td class="not-covered">Not Covered</td>
									<td class="covered">Covered</td>
								</tr>
								<tr>
									<td>14.</td>
									<td style="text-align: justify;">Domestic helper’s property</td>
									<td class="not-covered">Not Covered</td>
									<td class="covered">Covered</td>
								</tr>
							</table>
							<br />
							<span style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500;">
								By paying an additional premium, you can expand the coverage to include:
							</span>

							<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: center;">
								<tr style="background-color: #FFC000;">
									<th style="width: 5%">No.</th>
									<th style="width: 65%">Benefit Type</th>
									<th style="width: 15%">
										Houseowner<br/>
										(Building)
									</th>
									<th style="width: 15%">
										Householder<br/>
										(Contents)
									</th>
								</tr>
								<tr>
									<td>1.</td>
									<td style="text-align: justify;">Riot, Strike and Malicious Damage</td>
									<td class="covered">Covered</td>
									<td class="covered">Covered</td>
								</tr>
								<tr>
									<td>2.</td>
									<td style="text-align: justify;">
										Unoccupancy in excess of ninety (90) days
									</td>
									<td class="not-covered">Not Covered</td>
									<td class="covered">Covered</td>
								</tr>
								<tr>
									<td>3.</td>
									<td style="text-align: justify;">
										Theft without actual forcible and violent breaking into
										and/or out excluding theft by domestic servants or member of family/household
									</td>
									<td class="not-covered">Not Covered</td>
									<td class="covered">Covered</td>
								</tr>
							</table>

							<br />
							<span>
								<strong>Note:</strong>
							</span>
							<div style="text-align: justify">
								<ol>
									<li>Please refer to the policy contract for further details of the above benefits.</li>
									<li>
										Duration of cover is for one (1) year. You need to renew the insurance cover annually.
									</li>
									<li>
										The benefits payable under eligible product are protected by Perbadanan Insurans Deposit
										Malaysia (PIDM) up to limits. Please refer to PIDM's Takaful and Insurance Benefits
										Protection System (TIPS) Brochure or contact us or PIDM (visit www.pidm.gov.my).
									</li>
								</ol>
							</div>
							<br />

							<span>
								<strong>Your policy does not cover certain losses, such as:</strong>
							</span>
							<ol>
								<li>Loss or damage due to subsidence, landslip, riot, strike and malicious damage;</li>
								<li>
									Loss or damage due to war, civil war and any act of terrorism;
								</li>
								<li>
									Loss or damage to building if left unattended for more than ninety (90) days (unless it
									is notified in writing to us and agreed by us by way of an endorsement issued);
								</li>
								<li>
									Loss or damage due to radioactive and nuclear energy risks.
								</li>
							</ol>

							<p>
								<strong>Note: </strong>This list is non-exhaustive. Please refer to the policy contract for
								the full list of exclusions.
							</p>
						</td>
					</tr>
				</table>
				<br/>

				<!--Page Break-->
				<div style="page-break-after: always"></div>
				<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: center; page-break-inside: avoid;">
					<tr>
						<td colspan="4" style="color: #000000; text-align: justify; vertical-align: top; border: none;">
							If you have any questions or require assistance on our home insurance product, you can:
						</td>
					</tr>
					<tr>
						<!-- Phone -->
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="Phone" height='45'>
								<xsl:attribute name="src">
									<xsl:value-of select="root/P_PhoneImage" />
								</xsl:attribute>
							</img>
							<br />
							Contact us at 1-300-13-8888
							<br />
							(Etiqa Oneline)
						</td>

						<!-- Website -->
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="Website" height='45'>
								<xsl:attribute name="src">
									<xsl:value-of select="root/P_WebsiteImage" />
								</xsl:attribute>
							</img>
							<br />
							Visit us at
							<br />
							<xsl:value-of select="root/P_WebsiteUrl" />
						</td>

						<!-- Email -->
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="Email" height='45'>
								<xsl:attribute name="src">
									<xsl:value-of select="root/P_EmailImage" />
								</xsl:attribute>
							</img>
							<br />
							Email us at
							<br />
							info@etiqa.com.my
						</td>

						<!-- QR Code -->
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="QR Code" height='80'>
								<xsl:attribute name="src">
									<xsl:value-of select="root/P_QRCodeImage" />
								</xsl:attribute>
							</img>
							<br />
							Scan the QR code
						</td>
					</tr>
				</table>

				<br/>

				<img alt="Number3Image" height='20'>
					<xsl:attribute name="src">
						<xsl:value-of select="root/P_Number3Image" />
					</xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px;  font-weight: 700;">
					 Know Your Obligations
				</strong>
				<table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%; vertical-align: top;text-align: justify;font-family: Arial, sans-serif; font-size: 14px;">
					<tr>
						<td colspan=" 2">
							<strong>
								For this Houseowner/Householder Insurance, the premium that you have to pay annually is
								calculated based on your sum insured and selected additional perils, if any. As an
								illustration of RM <xsl:value-of select="root/P_CoverageAmount" />
								, you must pay:
							</strong>
						</td>
					</tr>
					<tr>
						<td>Basic Premium For Standard Cover</td>
						<td>
							RM <xsl:value-of select="root/P_PlanPremium" />
						</td>
					</tr>
					<xsl:if test="root/P_HasAddOn = 'true'">
						<tr>
							<td>
								Additional Cover<br />
								<xsl:for-each select="/root/P_AddOn[position() &lt;= 4]">
									<xsl:value-of select="position()" />
									.
									<xsl:value-of select="Name" />
									<br />
								</xsl:for-each>
							</td>
							<td>
								<br />
								<xsl:for-each select="/root/P_AddOn[position() &lt;= 4]">
									<xsl:text>RM </xsl:text>
									<xsl:value-of select="Premium" />
									<br />
								</xsl:for-each>
							</td>
						</tr>
					</xsl:if>
					<xsl:if test="root/P_HasAddOn = 'false'">
						<tr>
							<td>
								Additional Cover<br />
								Not Applicable
							</td>
							<td>
								<br />
								RM 0.00
							</td>
						</tr>
					</xsl:if>
					<xsl:if test="root/P_IsCommissionAgency = 'false' and root/P_IsCommissionBanca = 'false'">
						<tr>
							<td>(-) Discount to customer</td>
							<td>
								<xsl:value-of select="root/P_DiscountRate" />
								% or RM <xsl:value-of select="root/P_DiscountAmount" />
							</td>
						</tr>
					</xsl:if>
					<tr>
						<td>
							Total Premium
						</td>
						<td>
							RM <xsl:value-of select="root/P_NetPremium" />
						</td>
					</tr>
					<tr>
						<td colspan="2">
							<strong>You also have to pay the following fees and charges:</strong>
						</td>
					</tr>
					<xsl:if test="root/P_IsCommissionAgency = 'true' or root/P_IsCommissionBanca = 'true'">
						<tr>
							<td>
								Commission Paid To The Intermediary
							</td>
							<td>
								<xsl:value-of select="root/P_CommissionRate" />
								% or RM
								<xsl:value-of select="root/P_CommissionAmount" />
							</td>
						</tr>
					</xsl:if>
					<tr>
						<td>
							Service Tax
						</td>
						<td>
							<xsl:value-of select="root/P_ServiceTaxRate" />
							% of total premium or RM
							<xsl:value-of select="root/P_ServiceTaxAmount" />
						</td>
					</tr>
					<tr>
						<td>Stamp Duty</td>
						<td>
							RM <xsl:value-of select="root/P_StampDuty" />
						</td>
					</tr>
					<tr>
						<td>Total Premium Payable</td>
						<td>
							RM <xsl:value-of select="root/P_TotalPremium" />
						</td>
					</tr>
					<tr>
						<td colspan="2">
							All premiums (if applicable) will be subjected to relevant charges or taxes as deemed necessary
							by the Malaysia tax authorities. It is important to keep any receipt that you receive as proof
							of payment of premiums.
						</td>
					</tr>
				</table>
				<br />

				<img alt="Number4Image" height='20'>
					<xsl:attribute name="src">
						<xsl:value-of select="root/P_Number4Image" />
					</xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px;  font-weight: 700;">
					 Other Key Terms
				</strong>
				<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: justify;">
					<tr >
						<td >
							<div style="text-align: justify">
								<ol >
									<li >
										You must provide complete and accurate information during the application.
									</li>
									<li >
										The insurance coverage only be effective once you have paid the premium (Cash Before
										Cover).
									</li>
									<li >
										All claims must be notified to us as soon as possible but not later than thirty (30)
										days after any event which may entitle you to claim under the policy. Send to us
										immediately all relevant documents to support your claims. Any documents or evidence
										required by us to verify the claim shall be provided by you at your own expense.
									</li>
									<li >
										Market value
										<ol type="i" >
											<li >
												You must make sure that your property is adequately insured at all times, taking
												into account the renovations and enhancements made to your property. The sum
												insured should cover the cost of rebuilding and replacement of your property in
												the event of loss or damage.
											</li>
											<li >
												To assist you in determining the sum insured, you may use the estimated building
												cost calculator provided by Persatuan Insurans Am Malaysia (PIAM) via the
												following link:
												https://bcc.piam.org.my/. Please
												note that you are advised to seek independent professional advise if the
												property had been extensively renovated and/or have unique/non-standard design.
											</li>
										</ol>
									</li>
									<li >
										Average &#45; If your insured property hereby shall, at the time of loss, be of greater
										value than the sum insured, then you shall be considered as being insured on your own
										for any difference, and shall bear a rateable proportion of the loss accordingly.
									</li>
									<li >
										Excesses &#45; The amount of loss you have to bear and is applicable to certain perils,
										such as Overflowing of water tanks, apparatus or pipes, Hurricane, Cyclone, Typhoon,
										Windstorm, Earthquake, Volcanic Eruption, and Flood.
									</li>
									<li >
										Coverage under Householder &#45; If any of your household items is of greater than 5% of
										the total sum insured; you are advised to - declare these items separately.
									</li>
								</ol>
							</div>
							
							<p style="margin-top: 15px;">
								<strong>Note: </strong>This list is non exhaustive. Please refer to the policy contract for the full list of terms and conditions.
							</p>
						</td>
					</tr>
				</table>
				<br />

				<img alt="Red Question Mark" height='20'>
					<xsl:attribute name="src">
						<xsl:value-of select="root/P_QuestionMarkImage" />
					</xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px;  font-weight: 700;">
					Can I cancel my policy?
				</strong>
				<br />
				<div style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500; text-align: justify;">
					Yes. You may cancel your policy at any time by giving written notice us. Upon cancellation, you are
					entitled to a partial refund of the premium provided you have not made a claim.
				</div>
			</body>

			<footer style="
  position: fixed;
  bottom: 0;
  right: 15px;
  color: gray;
  font-size: 12px;
  background: transparent;
  ">
				PMG/EGIB/HOHH/PDS/ENG/2601V0.1
			</footer>

		</html>
	</xsl:template>
</xsl:stylesheet>