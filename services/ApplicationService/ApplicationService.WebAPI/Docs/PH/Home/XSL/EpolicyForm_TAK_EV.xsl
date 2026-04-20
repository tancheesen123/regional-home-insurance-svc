<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<html>
			<body>
				<div style="justify-content: space-between">
					<div style="height:165px">
						<table>
							<tr style="height:0.2px"></tr>
						</table>
						<img
							height="115px"
					  style="float:right;padding-right:12px;"
          >
							<xsl:attribute name="src">
								<xsl:value-of select="root/ImageEgtbEnHeader"/>
							</xsl:attribute>
						</img>
					</div>
					<div
					  style="
                padding-left: 30px;
                padding-right: 30px;
                text-align: justify;
                font-family: Arial, Helvetica, sans-serif;
                line-height: 1.1499023;
              "
            >
						<p style="font-size: 16px; padding-bottom: 10px">
							Date :
							<span style="padding-left: 5px"
                  >
								<xsl:value-of select="root/P_Date"
                />
							</span>
						</p>
						<p style="font-size: 20px; margin-block-end: 30px">
							<xsl:value-of select="root/P_Name" />
						</p>
						<p
						  style="
                  margin-block-end: 0px;
                  margin-block-start: 0px;
                  font-size: 16px;
                  padding: 2px;
                  padding-left: 0px;
                "
              >
							<xsl:value-of select="root/P_Address1" />
						</p>
						<p
						  style="
                  margin-block-end: 0px;
                  margin-block-start: 0px;
                  font-size: 16px;
                "
              >
							<xsl:value-of select="root/P_Address2" />
						</p>
						<p
						  style="
                  margin-block-end: 0px;
                  margin-block-start: 0px;
                  font-size: 16px;
                "
              >
							<xsl:value-of select="root/P_Address3" />
						</p>
						<p
						  style="
                  margin-block-end: 60px;
                  margin-block-start: 0px;
                  font-size: 16px;
                "
              >
							<xsl:value-of select="root/P_Address4" />
						</p>
						<p style="font-size: 18px; margin-block-end: 25px">
							<u>
								THANK YOU FOR STAYING SECURE WITH ETIQA. WE ARE DELIGHTED TO INFORM YOU THAT YOUR COVERAGE IS NOW EFFECTIVE
							</u>
						</p>
						<table style="width:100%;text-align:justify">
							<tr style="height:40px">
								<td style="width:25%;text-align:center; text-align:left;">Certificate No. </td>
								<td style="width:3%;">:</td>
								<td style="width:72%;">
									<xsl:value-of select="root/P_PolicyNo" />
								</td>
							</tr>
							<tr style="height:40px">
								<td style="width:25%;text-align:center;text-align:left;">Plan Name</td>
								<td style="width:3%;">:</td>
								<td style="width:72%;">
									<!--<xsl:value-of select="root/P_PlanName" />-->
									<xsl:value-of select="root/P_CoverTypeName" />
								</td>
							</tr>
							<tr style="height:40px">
								<td style="width:25%;text-align:center; text-align:left;">Period</td>
								<td style="width:3%;">:</td>
								<td style="width:72%;">
									<xsl:value-of select="root/P_PeriodofInsurance" />
								</td>
							</tr>
						</table>
						<hr style="border-style: solid" />
						<p style="font-size: 16px; margin-block-end: 20px">
							We enclose herewith the following document for your action:-
						</p>

						<p style="font-size: 16px; margin-block-end: 20px">
							Certificate Schedule
						</p>

						<p style="font-size: 16px; margin-block-end: 20px">
							This important document summarizes the details of your certificate and we suggest that you keep this document for
							reference. Kindly be informed that the details stated in the certificate schedule is based on the information you have
							declared to us at the time of application. We advise that you check the document carefully and if there is any
							discrepancy, please inform us immediately. Our consultant will be glad to serve you.
						</p>
						<p style="font-size: 16px; margin-block-end: 20px">
							For any enquiries on the above or any of our products, feel free to call Etiqa Oneline at 1 300 13 8888 or e-mail us at
							info@etiqa.com.my. In case of any claim, you may call our Claim Assist at 1 300 88 1007 for fast and efficient claim
							service. Again, we welcome you to the Etiqa family.
						</p>
						<p style="font-size: 16px; margin-block-start:30px">
							Thank you.
						</p>
						<p style="font-size: 16px; margin-block-start:30px">
							Your sincerely, <br />Etiqa General Takaful Berhad
						</p>

						<p style="font-size:16px; margin-block-start:30px">
							The benefit(s) payable under eligible certificate is protected by PIDM up to limits. Please refer to <a style="cursor: pointer; text-decoration:none;" href="https://www.pidm.gov.my/en/how-we-protect-you/tips/information-materials/brochures">
								<i>PIDM's TIPS Brochure</i>
							</a> or contact Etiqa General Takaful Berhad or PIDM (visit <a style="cursor: pointer; text-decoration:none;" href="https://www.pidm.gov.my">www.pidm.gov.my</a>).
						</p>
						<br/>
						<br/>
						<p>
							Issue Date: <xsl:value-of select="root/P_Date"/><br/>
							Issue By : <xsl:value-of select="root/P_AgentCode"/>
						</p>
					</div>
				</div>

				<div style="page-break-after: always"></div>

				<!--Second page-->
				<div style="height:165px">
					<table>
						<tr style="height:0.2px"></tr>
					</table>
					<img height="115px" style="float:right;padding-right:12px;">
						<xsl:attribute name="src">
							<xsl:value-of select="root/ImageEgtbEnHeader"/>
						</xsl:attribute>
					</img>
				</div>
				<div
				  style="
            padding-left: 30px;
            padding-right: 30px;
            text-align: justify;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.1499023;
          "
        >
					<!--Header-->
					<div style="display: flex; justify-content: space-between">
						<div style="flex: 1;padding-top: 0px;">
							<p style="margin-block-start: 10px;font-size: 18px;padding-right:30px;font-family: Arial, Helvetica, sans-serif;">
								THE SCHEDULE
							</p>
						</div>
						<div style="flex: 1;padding-top: 0px;">
							<p style="margin-block-start: 10px;font-size: 18px;text-align:right;font-family: Arial, Helvetica, sans-serif; border: 2px solid black; padding: 5px; margin-left:300px;">
								STAMP DUTY PAID
							</p>
						</div>
					</div>

					<!--1st table-->
					<div style="display: flex; justify-content: space-between;font-size:16px;">
						<div style="flex:1; flex-basis: 40%; border: 2px solid black;padding-left:5px; text-align: left;">
							<p style="font-size: 16px; margin:5px;margin-bottom:10px;">
								<xsl:value-of select="root/P_Name" />
							</p>
							<p style="font-size: 16px; margin:5px;">
								<xsl:value-of select="root/P_Address1" />
							</p>
							<p style="font-size: 16px; margin:5px;">
								<xsl:value-of select="root/P_Address2" />
							</p>

							<p style="font-size: 16px; margin:5px;">
								<xsl:value-of select="root/P_Address3" />
							</p>

							<p style="font-size: 16px; margin:5px;">
								<xsl:value-of select="root/P_Address4" />
							</p>
							<p style="font-size: 16px; margin:5px;">

							</p>
						</div>
						<div style="flex:1;flex-basis: 60%;border: 2px solid black; border-left: 0px solid black;padding-left:5px;">
							<table style="width:100%; font-size:16px;">
								<tr>
									<td style="width:35%">Certificate Number</td>
									<td style="width:3%">:</td>
									<td style="width:62%">
										<xsl:value-of select="root/P_PolicyNo" />
									</td>
								</tr>
								<tr>
									<td>Account Number</td>
									<td>:</td>
									<td>
										<xsl:value-of select="root/P_AgentCode" />
									</td>
								</tr>
								<tr>
									<td>Product Type</td>
									<td>:</td>
									<td>
										<xsl:value-of select="root/P_CoverTypeName" />
									</td>
								</tr>
								<tr>
									<td colspan="3">
										<p style="text-align: justify; padding-top:5px;">
											Period of Takaful from <xsl:value-of select="root/P_StartDate" /> To <xsl:value-of select="root/P_EndDate" /> (both Dates Inclusive). Any subsequent period for which the Participant shall pay and
											the Takaful Operator agree to accept a renewal contribution.
										</p>
									</td>
								</tr>
							</table>
						</div>
					</div>
					<div style="height: 10px">
					</div>
					<!--2nd table-->
					<div style="border: 2px solid black; padding-left:5px;">
						<table style="width:100%; font-size:16px; ">
							<tr style="height: 30px;">
								<td style="width:45%;">Total Sum Covered</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">RM</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_TotalSumInsured" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">Basic Contribution</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">RM</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_AnnualPremium" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">Additional Benefits:</td>
								<td style="width:5%"></td>
								<td style="width:20%; text-align: right;"></td>
								<td style="width:30%; text-align: right;"></td>
							</tr>
							<xsl:for-each select="root/P_AddOnItem/AddOnItem">
								<tr style="height: 30px;">
									<td style="width:45%;">
										<xsl:value-of select="Name" />
									</td>
									<td style="width:5%">:</td>
									<td style="width:20%; text-align: right;">RM</td>
									<td style="width:30%; text-align: right;">
										<xsl:value-of select="Price" />
									</td>
								</tr>
							</xsl:for-each>
							<!-- <tr style="height: 30px;">
                <td style="width:45%;">Riot, Strike and Malicious Damage</td>
                <td style="width:5%">:</td>
                <td style="width:20%; text-align: right;">RM</td>
                <td style="width:30%; text-align: right;">xxxx.xx</td>
            </tr> -->
							<tr style="height: 30px;">
								<td style="width:45%;">Total Gross Contribution</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">RM</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_GrossPremium" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">
									Rebate (<xsl:value-of select="root/P_DiscountRate" />%)
								</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">(-) RM</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_Discount" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">Gross Contribution After Discount</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">RM</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_GrossPremiumAfterDiscount" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">
									Service Tax (<xsl:value-of select="root/P_TaxRate" />%)
								</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">RM</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_Tax" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">Stamp Duty</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">RM</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_StampDuty" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">Total Contribution</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;border-top: 2px solid black;">RM</td>
								<td style="width:30%; text-align: right;border-top: 2px solid black;">
									<xsl:value-of select="root/P_Total" />
								</td>
							</tr>
						</table>
					</div>

					<div style="padding-left:5px; border:2px solid black; margin-top:5px;">
						<table style="width:100%; font-size:16px">
							<tr style="height: 40px;">
								<td style="width:45%;">Risk Number</td>
								<td style="width:5%">:</td>
								<td style="width:50%; text-align: left;">
									<xsl:value-of select="root/P_RiskNo" />
								</td>
							</tr>
							<tr style="height: 40px;">
								<td style="width:45%;">IP Reference Number</td>
								<td style="width:5%">:</td>
								<td style="width:50%; text-align: left;"></td>
							</tr>
							<tr>
								<td style="width:45%;">Location of Risk</td>
								<td style="width:5%">:</td>
								<td style="width:50%; text-align: left;">
									<xsl:value-of select="root/P_PropertyAddress1" />
								</td>
							</tr>
							<tr>
								<td style="width:45%;"></td>
								<td style="width:5%"></td>
								<td style="width:50%; text-align: left;">
									<xsl:value-of select="root/P_PropertyAddress2" />
								</td>
							</tr>
							<tr>
								<td style="width:45%;"></td>
								<td style="width:5%"></td>
								<td style="width:50%; text-align: left;">
									<xsl:value-of select="root/P_PropertyAddress3" />
								</td>
							</tr>
							<tr>
								<td style="width:45%;"></td>
								<td style="width:5%"></td>
								<td style="width:50%; text-align: left;">
									<xsl:value-of select="root/P_PropertyAddress4" />
								</td>
							</tr>
							<tr>
								<td style="width:45%;"></td>
								<td style="width:5%"></td>
								<td style="width:50%; text-align: left;">

								</td>
							</tr>

						</table>
					</div>

				</div>
				<table>
					<tr style="height: 28px"></tr>
				</table>
				<div style="page-break-after: always"></div>

				<!--3rd page-->
				<div style="height:165px">
					<table>
						<tr style="height:0.2px"></tr>
					</table>
					<img height="115px" style="float:right;padding-right:12px;">
						<xsl:attribute name="src">
							<xsl:value-of select="root/ImageEgtbEnHeader" />
						</xsl:attribute>
					</img>
				</div>
				<div style="
            padding-left: 30px;
            padding-right: 30px;
            text-align: justify;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.1499023;
          ">

					<!--1st table-->
					<xsl:choose>
						<xsl:when test="root/P_isBuilding = 'true'">
							<div style="padding-left:5px; border:2px solid black; margin-top:5px;">
								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;">Construction Classification </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_ConstructionClass" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Occupied As </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_BuildingType" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Cover Type </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_CoverTypeName" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Rate Type </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">Tariff Rate</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Rate (%) </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_BuildingRate" />
										</td>
									</tr>
								</table>

								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;">Item </td>
										<td style="width:40%" colsapn="2">Description of Property / Interest Covered</td>

										<td style="width:15%; text-align: right;" colspan="2">Sum Covered</td>
									</tr>
									<tr style="height: 40px;">
										<td style="width:45%;">1 </td>
										<td style="width:5%">On one unit building</td>
										<td style="width:5%">RM</td>
										<td style="text-align:right;">
											<xsl:value-of select="root/P_BuildingSumInsured" />
										</td>

									</tr>
									<tr style="height: 40px;">
										<td style="width:45%;"> </td>
										<td style="width:5%; text-align:right; padding-right:30px;">Total:</td>
										<td style="width:5%;border-top: 2px dashed black;border-bottom: 2px dashed black; padding-right:40px;">RM</td>
										<td style="border-top: 2px dashed black;border-bottom: 2px dashed black; text-align:right;" colspan="3">
											<xsl:value-of select="root/P_BuildingSumInsured" />
										</td>

									</tr>

								</table>
								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;">Excess </td>
										<td style="width:5%" colsapn="2">:</td>

										<td style="width:50%; text-align: left;" colspan="2">Nil</td>
									</tr>

								</table>
							</div>
						</xsl:when>
					</xsl:choose>
					<xsl:choose>
						<xsl:when test="root/P_isContent = 'true'">
							<!--2nd table-->
							<div style="padding-left:5px; border:2px solid black; margin-top:5px;">
								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;">Construction Classification </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_ConstructionClass" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Occupied As </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_BuildingType" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Cover Type </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_CoverTypeName" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Rate Type </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">Tariff Rate</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Rate (%) </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_ContentRate" />
										</td>
									</tr>
								</table>

								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;">Item </td>
										<td style="width:40%" colsapn="2">Description of Property / Interest Covered</td>

										<td style="width:15%; text-align: right;" colspan="2">Sum Covered</td>
									</tr>
									<tr style="height: 40px;">
										<td style="width:45%;">1 </td>
										<td style="width:5%">On Content</td>
										<td style="width:5%">RM</td>
										<td style="text-align:right;">
											<xsl:value-of select="root/P_ContentSumInsured" />
										</td>

									</tr>
									<tr style="height: 40px;">
										<td style="width:45%;"> </td>
										<td style="width:5%; text-align:right; padding-right:30px;">Total:</td>
										<td style="width:5%;border-top: 2px dashed black;border-bottom: 2px dashed black; padding-right:40px;">RM</td>
										<td style="border-top: 2px dashed black;border-bottom: 2px dashed black; text-align:right;" colspan="3">
											<xsl:value-of select="root/P_ContentSumInsured" />
										</td>

									</tr>

								</table>
								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;">Excess </td>
										<td style="width:5%" colsapn="2">:</td>

										<td style="width:50%; text-align: left;" colspan="2">Nil</td>
									</tr>

								</table>

							</div>
						</xsl:when>
					</xsl:choose>
					<!--Home Content Declaration-->
					<xsl:choose>
						<xsl:when test="root/P_isContentDeclaration = 'true'">
							<table style="width:100%; padding-top:20px; border:2px solid black; margin-top:5px;">
								<tr>
									<td style="width:10%;">
										<u>Item</u>
									</td>
									<td style="width:20%;">
										<u>Type</u>
									</td>
									<td style="width:40%;">
										<u>Description of Property / Interest Covered</u>
									</td>
									<td style="width:25%;">
										<u>Itemized value</u>
									</td>
									<td style="width:10%;"></td>
								</tr>
								<xsl:for-each select="root/P_ContentDeclaration/ContentDeclarationItem">
									<tr>
										<td style="width:10%;">
											<xsl:value-of select="Number" />
										</td>
										<td style="width:20%;">
											<xsl:value-of select="DeclarationType" />
										</td>
										<td style="width:40%;">
											<xsl:value-of select="Description" />
										</td>
										<td style="width:25%;">RM</td>
										<td style="width:10%;">
											<xsl:value-of select="Value" />
										</td>
									</tr>
								</xsl:for-each>
								<xsl:choose>
									<xsl:when test="root/P_needAdditionalPage = 'false'">
										<tr style="height:30px;"></tr>
										<tr style="height:35px;">
											<td style="width:10%;"></td>
											<td style="width:20%;"></td>
											<td style="width:40%; text-align:right; padding-right:20px;">Total:</td>
											<td style="width:25%; border-top:2px dashed black;border-bottom:2px dashed black">RM</td>
											<td style="width:10%;border-top:2px dashed black;border-bottom:2px dashed black">
												<xsl:value-of select="root/P_TotalContentDeclaration" />
											</td>
										</tr>
									</xsl:when>
								</xsl:choose>
							</table>
						</xsl:when>
					</xsl:choose>

				</div>
				<table>
					<tr style="height: 28px"></tr>
				</table>
				<div style="page-break-after: always"></div>

				<!--3+1 Additional Page-->
				<xsl:choose>
					<xsl:when test="root/P_needAdditionalPage = 'true'">
						<div style="height:140px">
							<table>
								<tr style="height:0.2px"></tr>
							</table>
							<img
								height="115px"
						  style="float:right;margin-right:-21px"
          >
								<xsl:attribute name="src">
									<xsl:value-of select="root/ImageEgtbEnHeader"/>
								</xsl:attribute>
							</img>
						</div>
						<div
			 style="
            padding-left: 30px;
            padding-right: 30px;
            text-align: justify;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.1499023;
          "
        >
							<table style="width:100%; padding-top:20px;border:2px solid black;">
								<xsl:for-each select="root/P_ContentDeclaration2/ContentDeclarationItem2">
									<tr>
										<td style="width:10%;">
											<xsl:value-of select="Number" />
										</td>
										<td style="width:20%;">
											<xsl:value-of select="DeclarationType" />
										</td>
										<td style="width:40%;">
											<xsl:value-of select="Description" />
										</td>
										<td style="width:25%;">RM</td>
										<td style="width:10%;">
											<xsl:value-of select="Value" />
										</td>
									</tr>
								</xsl:for-each>
								<tr style="height:30px;"></tr>
								<tr style="height:35px;">
									<td style="width:10%;"></td>
									<td style="width:20%;"></td>
									<td style="width:40%; text-align:right; padding-right:20px;">Total:</td>
									<td style="width:25%; border-top:2px dashed black;border-bottom:2px dashed black">RM</td>
									<td style="width:10%;border-top:2px dashed black;border-bottom:2px dashed black">
										<xsl:value-of select="root/P_TotalContentDeclaration" />
									</td>
								</tr>
							</table>
						</div>
						<div style="page-break-after: always"></div>
					</xsl:when>
				</xsl:choose>
				<!--4th page-->
				<div
				  style="
            padding-left: 30px;
            padding-right: 30px;
            text-align: justify;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.1499023;
          "
        >
					<div style="height:140px">
						<table>
							<tr style="height:0.2px"></tr>
						</table>
						<img
							height="115px"
					  style="float:right;margin-right:-21px"
          >
							<xsl:attribute name="src">
								<xsl:value-of select="root/ImageEgtbEnHeader"/>
							</xsl:attribute>
						</img>
					</div>
					<div style="border: 1px solid black; padding: 10px;">
						<p>Subject to the following warranties, endorsements and clauses incorporated herein and part of the e-Certificate:</p>
						<table style="width: 100%; border-collapse: collapse;">
							<thead>
								<tr>
									<th style="text-align: left; padding: 5px;">Clause Code</th>
									<th style="text-align: left; padding: 5px;">Clause Name/Peril</th>
									<th style="text-align: left; padding: 5px;">Rate</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td style="padding: 5px;">C008</td>
									<td style="padding: 5px;">FOUNDATION EXCLUSION CLAUSE</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">C42B</td>
									<td style="padding: 5px;">DATE RECOGNITION (FOR HOUSEOWNER / HOUSEHOLDER CERTIFICATE ONLY)</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">C045</td>
									<td style="padding: 5px;">PROPERTY DAMAGE CLARIFICATION CLAUSE</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">W026</td>
									<td style="padding: 5px;">CONTRIBUTION WARRANTY</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">M002</td>
									<td style="padding: 5px;">INFORMATION ON IMB/CSB (AS PER IMPORTANT NOTICE ATTACHED)</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">C046</td>
									<td style="padding: 5px;">ASBESTOS EXCLUSION CLAUSE (APPLICABLE TO SECTION IIIB ONLY)</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">C047</td>
									<td style="padding: 5px;">RADIOACTIVE/NUCLEAR ENERGY RISKS EXCLUSION CLAUSE</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">W001</td>
									<td style="padding: 5px;">RESTRICTION OF MERCHANDISE WARRANTY</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">C049</td>
									<td style="padding: 5px;">TAKAFUL AND SURPLUS DISTRIBUTION CLAUSE</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">M007</td>
									<td style="padding: 5px;">CYBER AND DATA EXCLUSION</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">C051</td>
									<td style="padding: 5px;">COMMUNICABLE DISEASE ENDORSEMENT</td>
									<td style="padding: 5px;"></td>
								</tr>
								<xsl:choose>
									<xsl:when test="root/P_IsRsmdAddOnExist = 'true'">
										<tr>
											<td style="padding: 5px;">
												<xsl:value-of select="root/P_RsmdAddOnCode"/>
											</td>
											<td style="padding: 5px;">
												<xsl:value-of select="root/P_RsmdAddOnName"/>
											</td>
											<td style="padding: 5px;">
												<xsl:choose>
													<xsl:when test="root/P_IsLppsa != 'true'">
														<xsl:value-of select="root/P_RsmdAddOnRate"/>%
													</xsl:when>
												</xsl:choose>
											</td>
										</tr>
									</xsl:when>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="root/P_IsExtendedTheftAddOnExist = 'true'">
										<tr>
											<td style="padding: 5px;">
												<xsl:value-of select="root/P_ExtendedTheftAddOnCode"/>
											</td>
											<td style="padding: 5px;">
												<xsl:value-of select="root/P_ExtendedTheftAddOnName"/>
											</td>
											<td style="padding: 5px;">
												<xsl:value-of select="root/P_ExtendedTheftAddOnRate"/>%
											</td>
										</tr>
									</xsl:when>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="root/P_IsSubsidenceAndLandslideAddOnExist = 'true'">
										<tr>
											<td style="padding: 5px;">
												<xsl:value-of select="root/P_SubsidenceAndLandslideAddOnCode"/>
											</td>
											<td style="padding: 5px;">
												<xsl:value-of select="root/P_SubsidenceAndLandslideAddOnName"/>
											</td>
											<td style="padding: 5px;"></td>
										</tr>
									</xsl:when>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="root/P_IsDamagesByFailingTreeAddOnExist = 'true'">
										<tr>
											<td style="padding: 5px;">
												<xsl:value-of select="root/P_DamagesByFailingTreeAddOnCode"/>
											</td>
											<td style="padding: 5px;">
												<xsl:value-of select="root/P_DamagesByFailingTreeAddOnName"/>
											</td>
											<td style="padding: 5px;"></td>
										</tr>
									</xsl:when>
								</xsl:choose>
							</tbody>
						</table>

						<p style="margin-top: 20px;">CYBER AND DATA EXCLUSION</p>
						<p>Notwithstanding any provision to the contrary within this Certificate or any endorsement thereto this Certificate excludes any:</p>
						<p>
							1.1 Cyber Loss:<br/>
						</p>
						<table>

							<td style="vertical-align: top; text-align: left;" >1.2 </td>
							<td style="text-align: justify;">
								Loss, damage, liability, claim, cost, expense of whatsoever nature directly or indirectly caused by, contributed to
								by, resulting from, arising out of or in connection with any loss of use, reduction in functionality, repair,
								replacement, restoration or reproduction of any Data, including any amount pertaining to the value of such Data;
								regardless of any other cause or event contributing concurrently or in any other sequence thereto.
								In the event any portion of this endorsement is found to be invalid or unenforceable, the remainder shall remain
								in full force and effect.
								This endorsement supersedes and, if in conflict with any other wording in the Certificate or any endorsement

							</td>

						</table>




						<p style="margin-top: 20px;">Definitions</p>
						<p>
							Cyber Loss means any loss, damage, liability, claim, cost or expense of whatsoever nature directly or indirectly caused by, contributed to by, resulting from, arising out of or in connection with any Cyber Act or Cyber Incident including, but not limited to, any action taken in controlling, preventing, suppressing or remediating any Cyber Act or Cyber Incident. Cyber Act means an unauthorised, malicious or criminal act or series of related unauthorised, malicious or criminal acts, regardless of time and place, or the threat or hoax thereof involving access to, processing of, use of or operation of any Computer System.
						</p>

						<p>Cyber Incident means:</p>
						<ol style="margin-left: 10px;">
							<li>Any error or omission or series of related errors or omissions involving access to, processing of, use of or operation of any Computer System; or</li>
							<li>Any partial or total unavailability or failure or series of related partial or total unavailability or failures to access, process, use or operate any Computer System.</li>
						</ol>

						<p>Computer System means:</p>
						<p>Any computer, hardware, software, communications system, electronic device (including, but not limited to, smart phone, laptop, tablet, wearable device), server, cloud or microcontroller including any similar system or any configuration of the aforementioned and including any associated input, output, data storage device, networking equipment or back up facility, owned or operated by the Covered or by any other party.</p>

						<p style="padding-bottom:70px;">Data means information, facts, concepts, code or any other information of any kind that is recorded or transmitted in a form to be used, accessed, processed, transmitted or stored by a Computer System.</p>
					</div>

				</div>
				<table>
					<tr style="height:30px"></tr>
				</table>
				<div style="page-break-after: always"></div>

				<!--5th page-->
				<div style="height:150px">
					<table>
						<tr style="height:0.2px"></tr>
					</table>
					<img height="115px" style="float:right;padding-right:12px;">
						<xsl:attribute name="src">
							<xsl:value-of select="root/ImageEgtbEnHeader" />
						</xsl:attribute>
					</img>
				</div>
				<div style="
        padding-left: 30px;
        padding-right: 30px;
        text-align: justify;
        font-family: Arial, Helvetica, sans-serif;
        line-height: 1.1499023;
      ">
					<div style="border: 1px solid black; padding: 10px;">
						<p style="text-align: left; margin-bottom: 20px;">COMMUNICABLE DISEASE ENDORSEMENT</p>
						<table>

							<td style="vertical-align: top; text-align: left;" >1. </td>
							<td style="text-align: justify;padding-left:15px;">
								This certificate, subject to all applicable terms, conditions and exclusions, covers losses attributable to direct
								physical loss or physical damage occurring during the period of takaful. Consequently, and notwithstanding any
								other provision of this certificate to the contrary, this certificate does not cover any loss, damage, liability, claim,
								cost or expense of whatsoever nature, directly or indirectly caused by, arising out of, resulting from, attributable
								to or in connection with (regardless occurring concurrently or in any sequence) with a Communicable Disease or
								the fear or threat (whether actual or perceived) of a Communicable Disease.
							</td>

						</table>

						<table>

							<td style="vertical-align: top; text-align: left;" >2. </td>
							<td style="text-align: justify;padding-left:15px;">
								For the purposes of this endorsement, loss, damage, liability, claim, cost or expense of whatsoever nature includes, but is not limited to, any cost to clean-up, detoxify, remove, monitor or test:
							</td>

						</table>

						<table style="padding-left:30px;">
							<tr>
								<td style="vertical-align: top; text-align: left;" >2.1 </td>
								<td style="text-align: justify; padding-left:15px;">
									for a Communicable Disease, or
								</td>
							</tr>
							<tr>
								<td style="vertical-align: top; text-align: left;" >2.2 </td>
								<td style="text-align: justify; padding-left:15px;">
									any property covered hereunder that is affected by such Communicable Disease.
								</td>
							</tr>
						</table>

						<table>

							<td style="vertical-align: top; text-align: left;" >3 </td>
							<td style="text-align: justify; padding-left:15px;">
								As used herein, a Communicable Disease means any disease which can be transmitted by means of any substance or agent from any organism to another organism where:
							</td>

						</table>
						<table style="padding-left:30px;">
							<tr>
								<td style="vertical-align: top; text-align: left;" >3.1 </td>
								<td style="text-align: justify; padding-left:15px;">
									the substance or agent includes, but is not limited to, a virus, bacterium, parasite or other organism or any variation thereof, whether deemed living or not, and
								</td>
							</tr>
							<tr>
								<td style="vertical-align: top; text-align: left;" >3.2 </td>
								<td style="text-align: justify; padding-left:15px;">
									the method of transmission, whether direct or indirect, includes but is not limited to, airborne transmission, bodily fluid transmission, transmission from or to any surface or object, solid, liquid or gas or between organisms, and
								</td>
							</tr>
							<tr>
								<td style="vertical-align: top; text-align: left;" >3.3 </td>
								<td style="text-align: justify; padding-left:15px;">
									the disease, substance or agent can cause or threaten damage to human health or human welfare or can cause or threaten damage to, deterioration of, loss of value of, marketability of or loss of use of property covered hereunder.
								</td>
							</tr>
						</table>
						<table style="width:100%;">

							<td style="vertical-align: top; text-align: left;" >4. </td>
							<td style="text-align: justify;padding-left:15px;">
								This endorsement applies to all coverage extensions, additional coverages, exceptions to any exclusion and other coverage grant(s).
							</td>

						</table>
						<p style="padding-left:35px;">All other terms, conditions and exclusions of the certificate remain the same.</p>

						<p style="text-align: left; margin-top: 20px;">SANCTION LIMITATION AND EXCLUSION CLAUSE</p>
						<p>This e-Certificate shall not provide cover and the Company shall not be liable to pay any claim or provide any benefit hereunder to the extent that the provision of such cover, payment of such claim or provision of such benefit would expose the Company to any Sanction, prohibition or restriction under the CISAD Act or United Nations resolutions or trade or economic sanctions, laws or regulations of the European Union, United Kingdom.</p>

						<p style="text-align: left; margin-top: 20px;">Limits of Liability</p>
						<p>1. We will not be liable for:</p>
						<table style="width:100%; padding-left:30px;">
							<tr>
								<td>a)</td>
								<td style="text-align: justify;padding-left:5px;">
									Under Covered event 5 for the first RM50.00.
								</td>
							</tr>
							<tr>
								<td style="vertical-align: top; text-align: left;">b)</td>
								<td style="text-align: justify;padding-left:5px;">
									Under Covered events 7, 8 and 9 for the first one (1) per cent of the Total Sum Covered on Buildings or
									RM200.00 whichever is less
								</td>
							</tr>
						</table>
						<table style="width:100%;">

							<td style="vertical-align: top; text-align: left;" >2. </td>
							<td style="text-align: justify;padding-left:15px;">
								Limit of the amount of Our liability under Additional Benefit C) Compensation for Death: RM10,000.00 or one half of Total Sum Covered on Contents whichever is less.
							</td>

						</table>
						<table style="width:100%;">

							<td style="vertical-align: top; text-align: left;" >3. </td>
							<td style="text-align: justify;padding-left:15px;">
								Limit of the amount of Our liability under Additional Benefit F) Liability to the Public: RM50,000.00 any one accident or series of accidents constituting one occurrence in respect of Buildings and Contents respectively.
							</td>

						</table>
						<table style="width:100%;">

							<td style="width:25px;" >4. </td>
							<td style="text-align: justify;">
								Geographical Area: Malaysia
							</td>

						</table>

						<p style="text-align: left; margin-top: 20px;">UNDERWRITING INFORMATION</p>
						<p>
							<u>Does any of the following statements apply to you?</u>
						</p>
						<table style="width:100%;">
							<tr>
								<td style="vertical-align: top; text-align: left;" >1. </td>
								<td style="text-align: justify;padding-left:15px;">
									I made a claim or encountered any loss experience for the past two years on this or other property.
								</td>
							</tr>
							<tr>
								<td></td>
								<td style="text-align: justify;padding-left:15px;">No</td>
							</tr>
							<tr>
								<td style="vertical-align: top; text-align: left;" >2. </td>
								<td style="text-align: justify;padding-left:15px;">
									The residence will be left unoccupied for more than 90 days.
								</td>
							</tr>
							<tr>
								<td></td>
								<td style="text-align: justify;padding-left:15px;">No</td>
							</tr>

							<xsl:choose>
								<xsl:when test="root/P_StampDuty = 'true'">
									<tr>
										<td></td>
										<td style="text-align: justify;padding-left:15px; padding-top:15px;">This certificate is eligible for stamp duty exemption.</td>
									</tr>
								</xsl:when>
							</xsl:choose>

						</table>

					</div>
				</div>
				<div style="page-break-after: always"></div>
				<!--6th page-->
				<div style="height:165px">
					<table>
						<tr style="height:0.2px"></tr>
					</table>
					<img
						height="115px"
				  style="float:right;padding-right:12px;"
          >
						<xsl:attribute name="src">
							<xsl:value-of select="root/ImageEgtbEnHeader"/>
						</xsl:attribute>
					</img>
				</div>
				<div
				  style="
        padding-left: 30px;
        padding-right: 30px;
        text-align: justify;
        font-family: Arial, Helvetica, sans-serif;
        line-height: 1.1499023;
      "
    >

					<div style="border: 1px solid black; padding: 10px;">
						<p style="text-align: left; margin-bottom: 20px;">YOUR DUTY TO INFORM US</p>
						<p>
							Where You have applied for this Takaful wholly for purposes unrelated to Your trade, business or profession, You
							had a duty to take reasonable care not to make a misrepresentation in answering the questions in the Application (or
							when You applied for this Takaful) i.e. You should have answered the questions fully and accurately. Failure to have
							taken reasonable care in answering the questions may result In avoidance of Your contract of Takaful, refusal or
							reduction of Your claim(s), change of terms or termination of Your contract of Takaful in accordance with the
							remedies in Schedule 9 of the Islamic Financial Services Act 2013.You were also required to disclose any other
							matter that You knew to be relevant to our decision in accepting the risks and determining the rates and terms to be
							applied
						</p>

						<p>
							You also have a duty to tell us immediately if at any time after Your contract of Takaful has been entered into, varied
							or renewed with Us any of the information given in the Application (or when You applied for this Takaful) is inaccurate
							or has changed.
						</p>

						<p style="text-align: left; margin-top: 20px;">CHANGES IN TAXATION, REGULATIONS AND LEGISLATION</p>
						<p>
							We may vary the terms of this Certificate if there are changes in taxation, regulations or legislation that affect this
							Certificate. We shall notify You in writing when the terms in this Certificate need to be changed.
						</p>
						<xsl:choose>
							<xsl:when test="root/P_IsLppsa = 'true'">
								<p>
									If any such tax applies, it shall be Your obligation to pay such chargeable tax (where applicable).
								</p>
								<p style="padding-bottom: 30px">
									In the event You do not pay such all value added tax, goods and services tax or any other tax of a similar nature,
									We may, but are not obliged to, pay such tax on Your behalf, and You shall reimburse or indemnify Us for all of
									such tax upon demand by Us.
								</p>
							</xsl:when>
							<xsl:otherwise>
								<p style="padding-bottom:100px;"></p>
							</xsl:otherwise>
						</xsl:choose>

					</div>

					<div>
						<table style="width:100%; padding-top:20px;">
							<tr>
								<td style="width:20%;">Issue Date</td>
								<td style="width:5%;">:</td>
								<td style="width:40%;">
									<xsl:value-of select="root/P_Date" />
								</td>
								<td style="width:35%; text-align:right;">For and on behalf of</td>
							</tr>
							<tr>
								<td style="width:20%;">Issue By</td>
								<td style="width:5%;">:</td>
								<td style="width:40%; text-align:justify;">
									<xsl:value-of select="root/P_AgentCode" />
								</td>
								<td style="width:35%; text-align:right;">Etiqa General Takaful Berhad</td>
							</tr>
							<tr>
								<td colspan="4" style="height:70px;">This Certificate Schedule is a computer generated document and no signatory is required</td>
							</tr>
						</table>
					</div>

				</div>

				<div style="page-break-after: always"></div>

				<div style="height:120px">
					<table>
						<tr style="height:0.2px"></tr>
					</table>
					<img
						height="115px"
				  style="float:right;padding-right:12px;"
          >
						<xsl:attribute name="src">
							<xsl:value-of select="root/ImageEgtbEnHeader"/>
						</xsl:attribute>
					</img>
				</div>
				<div
				  style="
            padding-left: 30px;
            padding-right: 30px;
            text-align: justify;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.1499023;
          "
        >
					<div style="border: 1px solid black; height: 1050px">
						<p
						  style="
      font-size: 20px;
      border-bottom: 1px solid black;
      margin-block-start: 0px;
      padding: 6px;
      background-color: #ffc000;
      margin-block-end:5px;
	  text-align:center;
	  text-align:center;
	  padding-bottom: 15px;
	  padding-top: 15px;
    "
  >
							Personal Data Protection Act Slip for Individual Customers
						</p>
						<table style= "width:100%;">
							<tr style="height:40px;">
								<td style="width:30%;">Name:</td>
								<td style="width:5%;">:</td>
								<td style="width:65%; text-align:justify;">
									<xsl:value-of select="root/P_Name" />
								</td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">NRIC No</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;">
									<xsl:value-of select="root/P_Nric" />
								</td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">Certificate No</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;">
									<xsl:value-of select="root/P_PolicyNo" />
								</td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">Type of Certificate</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;">General Takaful</td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">Date</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;">
									<xsl:value-of select="root/P_Date" />
								</td>
							</tr>
						</table>
						<div style="font-size:16px;  font-family: Arial, Helvetica, sans-serif;text-align: justify; margin:10px;">
							<p>
								I/We, agree, consent and allow Etiqa General Takaful Berhad (hereinafter called "Etiqa General Takaful") to process my
								personal data (including sensitive personal data) ('Personal Data') with the intention of entering into a contract of
								Takaful, in compliance with the provisions of the Personal Data Protection Act 2010
							</p>
							<p>
								I/We, understand and agree that any Personal Data collected or held by Etiqa General Takaful (whether contained in
								this application or otherwise obtained) may be held, used, processed and disclosed by Etiqa General Takaful to
								individuals and/or organizations related to and associated with Etiqa General Takaful or any selected third party (within
								or outside Malaysia, including medical institutions, reinsurers, claim adjusters/investigators, solicitors, industry
								associations, regulators, statutory bodies and government authorities) for the purpose of processing this application
								and providing subsequent service related to it and to communicate with me/us for such purposes.
							</p>
							<p>
								I/We understand that I/We have a right to obtain access to and to request correction of any Personal Data held by Etiqa
								General Takaful concerning me/us.
							</p>
							<p>
								Such request can be made by completing the Access Request Form available at all Etiqa website, Etiqa Takaful
								branches/ or contact Etiqa General Takaful via email; PDPA@etiqa.com.my. In accordance with the provisions of the
								Personal Data Protection Act 2010, I/We may contact the Customer Service Centre at Etiqa Oneline 1 300 13 8888 for
								the details of my/our Personal Data. Such information shall only be granted upon verification.
							</p>
							<p>
								I/We agree, consent and allow Etiqa General Takaful to share my/our Personal Data with Maybank Group, Etiqa
								Takaful`s agents or strategic partners and other third parties ("other entities") as Etiqa General Takaful deems fit and
								I/We may receive marketing communication from Etiqa General Takaful or from these other entities about products and
								services that may be of interest to me/us.
							</p>
							<div>
								<table style="width: 100%; padding-top: 15px; padding-bottom: 15px;">
									<tr>
										<xsl:choose>
											<xsl:when test="root/P_Checked = 'false'">
												<div style="display:flex;">
													<td style="width: 50%;padding-bottom:35px;padding-left:300px">

														<img height="66px" >
															<xsl:attribute name="src">
																<xsl:value-of select="root/ImageUnchecked" />
															</xsl:attribute>
														</img>
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:80px;margin-top:-42px">Yes</p>

													</td>
												</div>
												<div style="display:flex;">
													<td style="width: 50%;padding-left:30px;padding-bottom:35px;">

														<img height="70px">
															<xsl:attribute name="src">
																<xsl:value-of select="root/ImageChecked" />
															</xsl:attribute>
														</img>
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:90px;margin-top:-42px">No</p>

													</td>
												</div>
											</xsl:when>
											<xsl:when test="root/P_Checked = 'true'">
												<div style="display:flex;">
													<td style="width: 50%;padding-bottom:35px;padding-left:300px">
														<img height="70px">
															<xsl:attribute name="src">
																<xsl:value-of select="root/ImageChecked" />
															</xsl:attribute>
														</img>
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:80px;margin-top:-42px">Yes</p>
													</td>
												</div>
												<div style="display:flex;">
													<td style="width: 50%;padding-left:40px;padding-bottom:35px;">
														<img height="66px">
															<xsl:attribute name="src">
																<xsl:value-of select="root/ImageUnchecked" />
															</xsl:attribute>
														</img>
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:70px;margin-top:-42px">No</p>
													</td>
												</div>
											</xsl:when>
										</xsl:choose>
									</tr>
								</table>
							</div>

							<p>
								Note: If you no longer wish to receive marketing communications, please notify Etiqa General Takaful to withdraw your
								consent and Etiqa General Takaful will stop processing and sharing your Personal Data with these other entities for the
								purpose of sending you marketing communications. For avoidance of doubt, the withdrawal does not include processing
								of your mandatory Personal Data.
							</p>
							<p style="font-size:18px; padding-top: 50px; padding-bottom: 30px;">
								THIS IS A COMPUTER GENERATED DOCUMENT AND IT DOES NOT REQUIRE A SIGNATURE
							</p>
						</div>

					</div>
				</div>
				<table>
					<tr style="height:90px"></tr>
				</table>
				<div style="margin-top:80px;bottom: 0;">
					<img
						  height="70px;"
					width="100%;"
            >
						<xsl:attribute name="src">
							<xsl:value-of select="root/ImageEgtbEnFooter"/>
						</xsl:attribute>
					</img>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
