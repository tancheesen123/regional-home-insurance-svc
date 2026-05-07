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
								<xsl:value-of select="root/ImageEgibEnHeader"/>
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
							Petsa :
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
								MARAMING SALAMAT SA INYONG PATULOY NA TIWALA SA ETIQA. IKINALULUGOD NAMING IPAALAM SA INYO NA ANG INYONG SAKLAW AY EPEKTIBO NA
							</u>
						</p>
						<table style="width:100%;text-align:justify">
							<tr style="height:40px">
								<td style="width:25%;text-align:center; text-align:left;">Blg. ng Patakaran</td>
								<td style="width:3%;">:</td>
								<td style="width:72%;">
									<xsl:value-of select="root/P_PolicyNo" />
								</td>
							</tr>
							<tr style="height:40px">
								<td style="width:25%;text-align:center;text-align:left;">Pangalan ng Plano</td>
								<td style="width:3%;">:</td>
								<td style="width:72%;">
									<xsl:value-of select="root/P_CoverTypeName" />
								</td>
							</tr>
							<tr style="height:40px">
								<td style="width:25%;text-align:center; text-align:left;">Panahon ng Seguro</td>
								<td style="width:3%;">:</td>
								<td style="width:72%;">
									<xsl:value-of select="root/P_PeriodofInsurance" />
								</td>
							</tr>
						</table>
						<hr style="border-style: solid" />
						<p style="font-size: 16px; margin-block-end: 20px">
							Ilakip namin ang sumusunod na dokumento para sa inyong aksyon:-
						</p>

						<p style="font-size: 16px; margin-block-end: 20px">
							Iskedyul ng Patakaran
						</p>

						<p style="font-size: 16px; margin-block-end: 20px">
							Ang mahalagang dokumentong ito ay nagbubuod ng mga detalye ng inyong patakaran at iminumungkahi naming itago ang dokumentong ito para sa sanggunian. Mangyaring ipaalam na ang mga detalyeng nakalagay sa iskedyul ng patakaran ay batay sa impormasyong inyong idineklara sa amin sa panahon ng aplikasyon. Pinapayuhan namin kayong suriin ang dokumento nang maingat at kung mayroong anumang pagkakaiba, mangyaring ipaalam sa amin agad. Ang aming konsultant ay handang maglingkod sa inyo.
						</p>
						<p style="font-size: 16px; margin-block-end: 20px">
							Para sa anumang katanungan tungkol sa itaas o sa alinman sa aming mga produkto, huwag mag-atubiling tumawag sa Etiqa Oneline sa 1 300 13 8888 o mag-email sa amin sa info@etiqa.com.my. Sa kaso ng anumang paghahabol, maaari kayong tumawag sa aming Claim Assist sa 1 300 88 1007 para sa mabilis at mahusay na serbisyo sa paghahabol. Muli, tinatanggap namin kayo sa pamilya ng Etiqa.
						</p>
						<p style="font-size: 16px; margin-block-start:30px">
							Maraming salamat.
						</p>
						<p style="font-size: 16px; margin-block-start:30px">
							Taos-pusong iyo, <br />Etiqa General Insurance Berhad
						</p>

						<p style="font-size:16px; margin-block-start:30px">
							Ang mga benepisyong babayaran sa ilalim ng karapat-dapat na patakaran ay protektado ng PIDM hanggang sa mga limitasyon. Mangyaring sumangguni sa <a style="cursor: pointer; text-decoration:none;" href="https://www.pidm.gov.my/en/how-we-protect-you/tips/information-materials/brochures">
								<i>PIDM's TIPS Brochure</i>
							</a> o makipag-ugnayan sa Etiqa General Insurance Berhad o PIDM (bisitahin ang <a style="cursor: pointer; text-decoration:none;" href="https://www.pidm.gov.my">www.pidm.gov.my</a>).
						</p>
						<br/>
						<br/>
						<p>
							Petsa ng Paglabas: <xsl:value-of select="root/P_Date"/><br/>
							Inilabas Ng : <xsl:value-of select="root/P_AgentCode"/>
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
							<xsl:value-of select="root/ImageEgibEnHeader"/>
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
								ANG ISKEDYUL
							</p>
						</div>
						<div style="flex: 1;padding-top: 0px;">
							<p style="margin-block-start: 10px;font-size: 18px;text-align:right;font-family: Arial, Helvetica, sans-serif; border: 2px solid black; padding: 5px; margin-left:300px;">
								NABAYARAN ANG SELYO
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
									<td style="width:35%">Blg. ng Patakaran</td>
									<td style="width:3%">:</td>
									<td style="width:62%">
										<xsl:value-of select="root/P_PolicyNo" />
									</td>
								</tr>
								<tr>
									<td>Blg. ng Account</td>
									<td>:</td>
									<td>
										<xsl:value-of select="root/P_AgentCode" />
									</td>
								</tr>
								<tr>
									<td>Uri ng Produkto</td>
									<td>:</td>
									<td>
										<xsl:value-of select="root/P_CoverTypeName" />
									</td>
								</tr>
								<tr>
									<td colspan="3">
										<p style="text-align: justify; padding-top:5px;">
											Panahon ng Seguro mula <xsl:value-of select="root/P_StartDate" /> Hanggang <xsl:value-of select="root/P_EndDate" /> (kasama ang Magkaparehong Petsa). Anumang kasunod na panahon kung saan magbabayad ang May-hawak ng Patakaran at sumasang-ayon ang Kumpanya ng Seguro na tumanggap ng premium ng pagpapanibago.
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
								<td style="width:45%;">Kabuuang Halaga ng Seguro</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">PHP</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_TotalSumInsured" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">Pangunahing Premium</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">PHP</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_AnnualPremium" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">Karagdagang Benepisyo:</td>
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
									<td style="width:20%; text-align: right;">PHP</td>
									<td style="width:30%; text-align: right;">
										<xsl:value-of select="Price" />
									</td>
								</tr>
							</xsl:for-each>
							<tr style="height: 30px;">
								<td style="width:45%;">Kabuuang Gross Premium</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">PHP</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_GrossPremium" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">
									Diskwento (<xsl:value-of select="root/P_DiscountRate" />%)
								</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">(-) PHP</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_Discount" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">Gross Premium Pagkatapos ng Diskwento</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">PHP</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_GrossPremiumAfterDiscount" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">
									Buwis sa Serbisyo (<xsl:value-of select="root/P_TaxRate" />%)
								</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">PHP</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_Tax" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">Selyo</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">PHP</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_StampDuty" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">Kabuuang Premium</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;border-top: 2px solid black;">PHP</td>
								<td style="width:30%; text-align: right;border-top: 2px solid black;">
									<xsl:value-of select="root/P_Total" />
								</td>
							</tr>
						</table>
					</div>

					<div style="padding-left:5px; border:2px solid black; margin-top:5px;">
						<table style="width:100%; font-size:16px">
							<tr style="height: 40px;">
								<td style="width:45%;">Blg. ng Panganib</td>
								<td style="width:5%">:</td>
								<td style="width:50%; text-align: left;">
									<xsl:value-of select="root/P_RiskNo" />
								</td>
							</tr>
							<tr style="height: 40px;">
								<td style="width:45%;">Blg. ng Sanggunian ng IP</td>
								<td style="width:5%">:</td>
								<td style="width:50%; text-align: left;"></td>
							</tr>
							<tr>
								<td style="width:45%;">Lokasyon ng Panganib</td>
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
							<xsl:value-of select="root/ImageEgibEnHeader" />
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
										<td style="width:45%;">Klasipikasyon ng Konstruksyon </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_ConstructionClass" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Ginagamit Bilang </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_BuildingType" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Uri ng Saklaw </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_CoverTypeName" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Uri ng Rate </td>
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
										<td style="width:45%;">Aytem </td>
										<td style="width:40%" colsapn="2">Paglalarawan ng Ari-arian / Interes na Siniseguro</td>

										<td style="width:15%; text-align: right;" colspan="2">Halaga ng Seguro</td>
									</tr>
									<tr style="height: 40px;">
										<td style="width:45%;">1 </td>
										<td style="width:5%">Sa isang yunit na gusali</td>
										<td style="width:5%">PHP</td>
										<td style="text-align:right;">
											<xsl:value-of select="root/P_BuildingSumInsured" />
										</td>

									</tr>
									<tr style="height: 40px;">
										<td style="width:45%;"> </td>
										<td style="width:5%; text-align:right; padding-right:30px;">Kabuuan:</td>
										<td style="width:5%;border-top: 2px dashed black;border-bottom: 2px dashed black; padding-right:40px;">PHP</td>
										<td style="border-top: 2px dashed black;border-bottom: 2px dashed black; text-align:right;" colspan="3">
											<xsl:value-of select="root/P_BuildingSumInsured" />
										</td>

									</tr>

								</table>
								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;">Sobra </td>
										<td style="width:5%" colsapn="2">:</td>

										<td style="width:50%; text-align: left;" colspan="2">Wala</td>
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
										<td style="width:45%;">Klasipikasyon ng Konstruksyon </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_ConstructionClass" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Ginagamit Bilang </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_BuildingType" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Uri ng Saklaw </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_CoverTypeName" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Uri ng Rate </td>
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
										<td style="width:45%;">Aytem </td>
										<td style="width:40%" colsapn="2">Paglalarawan ng Ari-arian / Interes na Siniseguro</td>

										<td style="width:15%; text-align: right;" colspan="2">Halaga ng Seguro</td>
									</tr>
									<tr style="height: 40px;">
										<td style="width:45%;">1 </td>
										<td style="width:5%">Sa Nilalaman</td>
										<td style="width:5%">PHP</td>
										<td style="text-align:right;">
											<xsl:value-of select="root/P_ContentSumInsured" />
										</td>

									</tr>
									<tr style="height: 40px;">
										<td style="width:45%;"> </td>
										<td style="width:5%; text-align:right; padding-right:30px;">Kabuuan:</td>
										<td style="width:5%;border-top: 2px dashed black;border-bottom: 2px dashed black; padding-right:40px;">PHP</td>
										<td style="border-top: 2px dashed black;border-bottom: 2px dashed black; text-align:right;" colspan="3">
											<xsl:value-of select="root/P_ContentSumInsured" />
										</td>

									</tr>

								</table>
								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;">Sobra </td>
										<td style="width:5%" colsapn="2">:</td>

										<td style="width:50%; text-align: left;" colspan="2">Wala</td>
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
										<u>Aytem</u>
									</td>
									<td style="width:20%;">
										<u>Uri</u>
									</td>
									<td style="width:40%;">
										<u>Paglalarawan ng Ari-arian / Interes na Siniseguro</u>
									</td>
									<td style="width:25%;">
										<u>Halagang Aytem</u>
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
										<td style="width:25%;">PHP</td>
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
											<td style="width:40%; text-align:right; padding-right:20px;">Kabuuan:</td>
											<td style="width:25%; border-top:2px dashed black;border-bottom:2px dashed black">PHP</td>
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
									<xsl:value-of select="root/ImageEgibEnHeader"/>
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
										<td style="width:25%;">PHP</td>
										<td style="width:10%;">
											<xsl:value-of select="Value" />
										</td>
									</tr>
								</xsl:for-each>
								<tr style="height:30px;"></tr>
								<tr style="height:35px;">
									<td style="width:10%;"></td>
									<td style="width:20%;"></td>
									<td style="width:40%; text-align:right; padding-right:20px;">Kabuuan:</td>
									<td style="width:25%; border-top:2px dashed black;border-bottom:2px dashed black">PHP</td>
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
								<xsl:value-of select="root/ImageEgibEnHeader"/>
							</xsl:attribute>
						</img>
					</div>
					<div style="border: 1px solid black; padding: 10px;">
						<p>Napapailalim sa mga sumusunod na garantiya, endorso at sugnay na kasama dito at bahagi ng e-Policy:</p>
						<table style="width: 100%; border-collapse: collapse;">
							<thead>
								<tr>
									<th style="text-align: left; padding: 5px;">Code ng Sugnay</th>
									<th style="text-align: left; padding: 5px;">Pangalan ng Sugnay/Panganib</th>
									<th style="text-align: left; padding: 5px;">Rate</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td style="padding: 5px;">C008</td>
									<td style="padding: 5px;">SUGNAY NG PAGBUBUKOD SA PUNDASYON</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">C42B</td>
									<td style="padding: 5px;">PAGKILALA SA PETSA (PARA SA PATAKARAN NG MAY-ARI NG BAHAY / NAKATIRA SA BAHAY LAMANG)</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">C045</td>
									<td style="padding: 5px;">SUGNAY NG PAGLILINAW SA PINSALA NG ARI-ARIAN</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">W026</td>
									<td style="padding: 5px;">GARANTIYA NG PREMIUM</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">M002</td>
									<td style="padding: 5px;">IMPORMASYON SA IMB/CSB (AYON SA MAHALAGANG ABISO NA KALAKIP)</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">C046</td>
									<td style="padding: 5px;">SUGNAY NG PAGBUBUKOD SA ASBESTOS (NAAANGKOP SA SEKSYON IIIB LAMANG)</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">C047</td>
									<td style="padding: 5px;">SUGNAY NG PAGBUBUKOD SA MGA PANGANIB NA RADIOAKTIBO/NUKLEAR NA ENERHIYA</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">W001</td>
									<td style="padding: 5px;">GARANTIYA NG PAGHIHIGPIT SA KALAKAL</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">C049</td>
									<td style="padding: 5px;">SUGNAY NG PAMAMAHAGI NG SEGURO AT LABIS</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">M007</td>
									<td style="padding: 5px;">PAGBUBUKOD SA CYBER AT DATA</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">C051</td>
									<td style="padding: 5px;">ENDORSO SA NAKAKAHAWANG SAKIT</td>
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

						<p style="margin-top: 20px;">PAGBUBUKOD SA CYBER AT DATA</p>
						<p>Hindi alintana ang anumang probisyon na salungat sa loob ng Patakarang ito o anumang endorso dito ang Patakarang ito ay nagbubukod ng anumang:</p>
						<p>
							1.1 Pagkawala sa Cyber:<br/>
						</p>
						<table>

							<td style="vertical-align: top; text-align: left;" >1.2 </td>
							<td style="text-align: justify;">
								Pagkawala, pinsala, pananagutan, paghahabol, gastos, o anumang gastos na maaaring direkta o hindi direktang sanhi, nag-ambag, nagmumula, nagmumula sa, o may kaugnayan sa anumang pagkawala ng paggamit, pagbaba ng functionality, pagkukumpuni, pagpapalit, pagpapanumbalik o pagpaparami ng anumang Data, kabilang ang anumang halaga na nauugnay sa halaga ng naturang Data; anuman ang ibang sanhi o kaganapan na nagsasabay o sa anumang iba pang pagkakasunod-sunod. Kung sakaling ang anumang bahagi ng endorsong ito ay natuklasang hindi wasto o hindi maipapatupad, ang natitira ay mananatiling buo at may bisa. Ang endorsong ito ay nagpapalit at, kung magkasalungat sa anumang iba pang salita sa Insurance o sa anumang endorso dito na may kaugnayan sa Pagkawala sa Cyber o Data, pinapalitan ang salitang iyon.
							</td>

						</table>

						<p style="margin-top: 20px;">Mga Kahulugan</p>
						<p>
							Ang Pagkawala sa Cyber ay nangangahulugang anumang pagkawala, pinsala, pananagutan, paghahabol, gastos o anumang gastos na maaaring direkta o hindi direktang sanhi, nag-ambag, nagmumula, nagmumula sa o may kaugnayan sa anumang Kilos sa Cyber o Insidente sa Cyber kabilang, ngunit hindi limitado sa, anumang aksyong ginawa sa pagkontrol, pag-iwas, pagpipigil o pagremedyo ng anumang Kilos sa Cyber o Insidente sa Cyber.
						</p>

						<p>Ang Insidente sa Cyber ay nangangahulugang:</p>
						<ol style="margin-left: 10px;">
							<li>Anumang pagkakamali o pagkukulang o serye ng mga kaugnay na pagkakamali o pagkukulang na kinasasangkutan ng pag-access, pagpoproseso, paggamit o operasyon ng anumang Sistema ng Kompyuter; o</li>
							<li>Anumang bahagyang o ganap na hindi pagiging available o kabiguan o serye ng mga kaugnay na bahagyang o ganap na hindi pagiging available o kabiguan na ma-access, maproseso, magamit o mapatakbo ang anumang Sistema ng Kompyuter.</li>
						</ol>

						<p>Ang Sistema ng Kompyuter ay nangangahulugang:</p>
						<p>Anumang kompyuter, hardware, software, sistema ng komunikasyon, electronic na aparato (kabilang, ngunit hindi limitado sa, smart phone, laptop, tablet, wearable device), server, cloud o microcontroller kabilang ang anumang katulad na sistema o anumang configuration ng nabanggit at kabilang ang anumang kaugnay na input, output, device ng pag-iimbak ng data, kagamitan sa networking o backup na pasilidad, na pag-aari o pinapatakbo ng Insured o ng anumang ibang partido.</p>

						<p style="padding-bottom:50px;">Ang Data ay nangangahulugang impormasyon, katotohanan, konsepto, code o anumang iba pang impormasyon ng anumang uri na naitala o inilipat sa isang form na gagamitin, ma-access, maproseso, mailipat o maiimbak ng isang Sistema ng Kompyuter.</p>
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
							<xsl:value-of select="root/ImageEgibEnHeader" />
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
						<p style="text-align: left; margin-bottom: 20px;">ENDORSO SA NAKAKAHAWANG SAKIT</p>
						<table>

							<td style="vertical-align: top; text-align: left;" >1. </td>
							<td style="text-align: justify;padding-left:15px;">
								Ang patakarang ito, napapailalim sa lahat ng naaangkop na mga tuntunin, kondisyon at pagbubukod, ay sumasaklaw sa mga pagkawalang maiuugnay sa direktang pisikal na pagkawala o pisikal na pinsala na nagaganap sa panahon ng seguro. Dahil dito, at hindi alintana ang anumang iba pang probisyon ng patakarang ito na salungat, ang patakarang ito ay hindi siniseguro ang anumang pagkawala, pinsala, pananagutan, paghahabol, gastos o anumang gastos, direkta o hindi direktang sanhi, nagmumula sa, nagbubunga mula sa, maiuugnay sa o may kaugnayan sa (hindi alintana kung nagaganap nang sabay o sa anumang pagkakasunod-sunod) sa isang Nakakahawang Sakit o takot o banta (maging aktwal o hinuhulaan) ng isang Nakakahawang Sakit.
							</td>

						</table>

						<table>

							<td style="vertical-align: top; text-align: left;" >2. </td>
							<td style="text-align: justify;padding-left:15px;">
								Para sa mga layunin ng endorsong ito, ang pagkawala, pinsala, pananagutan, paghahabol, gastos o anumang gastos ay kinabibilangan, ngunit hindi limitado sa, anumang gastos para sa paglilinis, pag-dedetoxify, pag-aalis, pagmo-monitor o pagsubok:
							</td>

						</table>

						<table style="padding-left:30px;">
							<tr>
								<td style="vertical-align: top; text-align: left;" >2.1 </td>
								<td style="text-align: justify; padding-left:15px;">
									para sa isang Nakakahawang Sakit, o
								</td>
							</tr>
							<tr>
								<td style="vertical-align: top; text-align: left;" >2.2 </td>
								<td style="text-align: justify; padding-left:15px;">
									anumang ari-arian na naseseguro dito na apektado ng naturang Nakakahawang Sakit.
								</td>
							</tr>
						</table>

						<table>

							<td style="vertical-align: top; text-align: left;" >3 </td>
							<td style="text-align: justify; padding-left:15px;">
								Ayon sa paggamit dito, ang isang Nakakahawang Sakit ay nangangahulugang anumang sakit na maaaring maiparating sa pamamagitan ng anumang sangkap o ahente mula sa anumang organismo patungo sa isa pang organismo kung saan:
							</td>

						</table>
						<table style="padding-left:30px;">
							<tr>
								<td style="vertical-align: top; text-align: left;" >3.1 </td>
								<td style="text-align: justify; padding-left:15px;">
									ang sangkap o ahente ay kinabibilangan, ngunit hindi limitado sa, isang virus, bakterya, parasito o iba pang organismo o anumang pagkakaiba-iba nito, maging ito ay itinuturing na may buhay o wala, at
								</td>
							</tr>
							<tr>
								<td style="vertical-align: top; text-align: left;" >3.2 </td>
								<td style="text-align: justify; padding-left:15px;">
									ang paraan ng pagpapalit, maging direkta o hindi direkta, ay kinabibilangan ngunit hindi limitado sa, pagpapalipat sa hangin, pagpapalipat ng likidong katawan, pagpapalipat mula sa o sa anumang ibabaw o bagay, solid, likido o gas o sa pagitan ng mga organismo, at
								</td>
							</tr>
							<tr>
								<td style="vertical-align: top; text-align: left;" >3.3 </td>
								<td style="text-align: justify; padding-left:15px;">
									ang sakit, sangkap o ahente ay maaaring magdulot o magbanta ng pinsala sa kalusugan o kagalingan ng tao o maaaring magdulot o magbanta ng pinsala, pagkasira, pagkawala ng halaga, kakayahang ibenta o pagkawala ng paggamit ng ari-ariang naseseguro dito.
								</td>
							</tr>
						</table>
						<table style="width:100%;">

							<td style="vertical-align: top; text-align: left;" >4. </td>
							<td style="text-align: justify;padding-left:15px;">
								Ang endorsong ito ay naaangkop sa lahat ng mga extension ng saklaw, karagdagang saklaw, mga pagbubukod sa anumang pagbubukod at iba pang probisyon ng saklaw.
							</td>

						</table>
						<p style="padding-left:35px;">Ang lahat ng iba pang mga tuntunin, kondisyon at pagbubukod ng patakaran ay nananatiling pareho.</p>

						<p style="text-align: left; margin-top: 20px;">SUGNAY NG LIMITASYON AT PAGBUBUKOD SA SANKSYON</p>
						<p>Ang e-Policy na ito ay hindi magbibigay ng saklaw at ang Kumpanya ay hindi mananagot na magbayad ng anumang paghahabol o magbigay ng anumang benepisyo dito hanggang sa antas na ang pagbibigay ng naturang saklaw, pagbabayad ng naturang paghahabol o pagbibigay ng naturang benepisyo ay maglalantad sa Kumpanya sa anumang Sanksyon, pagbabawal o paghihigpit sa ilalim ng CISAD Act o mga resolusyon ng United Nations o kalakalan o mga sanksyon sa ekonomiya, batas o mga regulasyon ng European Union, United Kingdom.</p>

						<p style="text-align: left; margin-top: 20px;">Mga Limitasyon ng Pananagutan</p>
						<p>1. Hindi kami mananagot para sa:</p>
						<table style="width:100%; padding-left:30px;">
							<tr>
								<td>a)</td>
								<td style="text-align: justify;padding-left:5px;">
									Sa ilalim ng Insured event 5 para sa unang PHP50.00.
								</td>
							</tr>
							<tr>
								<td style="vertical-align: top; text-align: left;">b)</td>
								<td style="text-align: justify;padding-left:5px;">
									Sa ilalim ng Insured events 7, 8 at 9 para sa unang isang (1) porsyento ng Kabuuang Halaga ng Seguro sa Mga Gusali o PHP200.00 alinman ang mas mababa
								</td>
							</tr>
						</table>
						<table style="width:100%;">

							<td style="vertical-align: top; text-align: left;" >2. </td>
							<td style="text-align: justify;padding-left:15px;">
								Limitasyon ng halaga ng aming pananagutan sa ilalim ng Karagdagang Benepisyo C) Kompensasyon para sa Kamatayan: PHP10,000.00 o kalahati ng Kabuuang Halaga ng Seguro sa Nilalaman alinman ang mas mababa.
							</td>

						</table>
						<table style="width:100%;">

							<td style="vertical-align: top; text-align: left;" >3. </td>
							<td style="text-align: justify;padding-left:15px;">
								Limitasyon ng halaga ng aming pananagutan sa ilalim ng Karagdagang Benepisyo F) Pananagutan sa Publiko: PHP50,000.00 sa anumang isang aksidente o serye ng mga aksidente na bumubuo ng isang pangyayari kaugnay ng Mga Gusali at Nilalaman ayon sa pagkakasunod-sunod.
							</td>

						</table>
						<table style="width:100%;">

							<td style="width:25px;" >4. </td>
							<td style="text-align: justify;">
								Heograpikong Lugar: Pilipinas
							</td>

						</table>

						<p style="text-align: left; margin-top: 20px;">IMPORMASYON SA UNDERWRITING</p>
						<p>
							<u>May nalalapat ba sa inyo ang alinman sa mga sumusunod na pahayag?</u>
						</p>
						<table style="width:100%;">
							<tr>
								<td style="vertical-align: top; text-align: left;" >1. </td>
								<td style="text-align: justify;padding-left:15px;">
									Gumawa ako ng paghahabol o nakaranas ng anumang pagkawala sa nakalipas na dalawang taon sa ari-ariang ito o iba pang ari-arian.
								</td>
							</tr>
							<tr>
								<td></td>
								<td style="text-align: justify;padding-left:15px;">Hindi</td>
							</tr>
							<tr>
								<td style="vertical-align: top; text-align: left;" >2. </td>
								<td style="text-align: justify;padding-left:15px;">
									Ang tirahan ay iiwan na walang nakatira nang higit sa 90 araw.
								</td>
							</tr>
							<tr>
								<td></td>
								<td style="text-align: justify;padding-left:15px;">Hindi</td>
							</tr>

							<xsl:choose>
								<xsl:when test="root/P_StampDuty = 'true'">
									<tr>
										<td></td>
										<td style="text-align: justify;padding-left:15px; padding-top:15px;">Ang patakarang ito ay karapat-dapat para sa exemption sa selyo.</td>
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
							<xsl:value-of select="root/ImageEgibEnHeader"/>
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
						<p style="text-align: left; margin-bottom: 20px;">ANG INYONG TUNGKULIN NA IPAALAM SA AMIN</p>
						<p>
							Kung ang Segurong ito ay inilapat ng Kayo nang buo para sa mga layuning hindi kaugnay sa inyong kalakalan, negosyo o propesyon, mayroon kayong tungkuling mag-ingat na hindi gumawa ng maling representasyon sa pagsagot sa mga tanong sa Aplikasyon (o noong inilapat ninyo ang Segurong ito) ibig sabihin ay dapat sagutin ninyo ang mga tanong nang buo at tama. Ang kabiguang mag-ingat sa pagsagot sa mga tanong ay maaaring magresulta sa pag-iwas sa inyong kontrata ng Seguro, pagtanggi o pagbabawas ng inyong mga paghahabol, pagbabago ng mga tuntunin o pagwawakas ng inyong kontrata ng Seguro alinsunod sa mga remedyo sa Iskedyul 9 ng Financial Services Act 2013. Kinailangan din ninyong ipahayag ang anumang iba pang bagay na alam ninyong may kaugnayan sa aming desisyon sa pagtanggap ng mga panganib at pagtukoy sa mga rate at tuntunin na ilalapat. Mayroon din kayong tungkulin na ipaalam sa amin agad kung sa anumang oras pagkatapos na maipasok, mabago o mapanibago ang inyong kontrata ng Seguro sa amin ang anumang impormasyong ibinigay sa Aplikasyon (o noong inilapat ninyo ang Segurong ito) ay hindi tama o nagbago.
						</p>

						<p>
							Mayroon din kayong tungkulin na ipaalam sa amin agad kung sa anumang oras pagkatapos na maipasok, mabago o mapanibago ang inyong kontrata ng Seguro sa amin ang anumang impormasyong ibinigay sa Aplikasyon (o noong inilapat ninyo ang Segurong ito) ay hindi tama o nagbago.
						</p>

						<p style="text-align: left; margin-top: 20px;">MGA PAGBABAGO SA PAGBUBUWIS, MGA REGULASYON AT BATAS</p>
						<p>
							Maaari naming baguhin ang mga tuntunin ng Patakarang ito kung may mga pagbabago sa pagbubuwis, mga regulasyon o batas na nakakaapekto sa Patakarang ito. Aabisuhan namin kayo sa pamamagitan ng sulat kapag kailangang baguhin ang mga tuntunin sa Patakarang ito.
						</p>
						<xsl:choose>
							<xsl:when test="root/P_IsLppsa = 'true'">
								<p>
									Kung ang anumang naturang buwis ay nalalapat, ito ang inyong obligasyon na magbayad ng naturang sinusukat na buwis (kung naaangkop).
								</p>
								<p style="padding-bottom: 30px">
									Kung hindi kayo magbabayad ng naturang lahat ng buwis sa karagdagang halaga, buwis sa mga kalakal at serbisyo o anumang iba pang buwis na may katulad na kalikasan, maaari kaming, ngunit hindi obligado, na magbayad ng naturang buwis sa inyong ngalan, at babayaran ninyo o magbabayad kayo sa amin para sa lahat ng naturang buwis sa kahilingan namin.
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
								<td style="width:20%;">Petsa ng Paglabas</td>
								<td style="width:5%;">:</td>
								<td style="width:40%;">
									<xsl:value-of select="root/P_Date" />
								</td>
								<td style="width:35%; text-align:right;">Para at sa ngalan ng</td>
							</tr>
							<tr>
								<td style="width:20%;">Inilabas Ng</td>
								<td style="width:5%;">:</td>
								<td style="width:40%; text-align:justify;">
									<xsl:value-of select="root/P_AgentCode" />
								</td>
								<td style="width:35%; text-align:right;">Etiqa General Insurance Berhad</td>
							</tr>
							<tr>
								<td colspan="4" style="height:70px;">Ang Iskedyul ng Patakaran na ito ay isang dokumentong nabuo ng computer at hindi nangangailangan ng pirma</td>
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
							<xsl:value-of select="root/ImageEgibEnHeader"/>
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
							Slip ng Batas sa Proteksyon ng Personal na Data para sa Mga Indibidwal na Customer
						</p>
						<table style= "width:100%;">
							<tr style="height:40px;">
								<td style="width:30%;">Pangalan:</td>
								<td style="width:5%;">:</td>
								<td style="width:65%; text-align:justify;">
									<xsl:value-of select="root/P_Name" />
								</td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">Blg. ng SSS/PhilSys ID</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;">
									<xsl:value-of select="root/P_Nric" />
								</td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">Blg. ng Patakaran</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;">
									<xsl:value-of select="root/P_PolicyNo" />
								</td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">Uri ng Patakaran</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;">General Insurance</td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">Petsa</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;">
									<xsl:value-of select="root/P_Date" />
								</td>
							</tr>
						</table>
						<div style="font-size:16px;  font-family: Arial, Helvetica, sans-serif;text-align: justify; margin:10px;">
							<p>
								Ako, sumasang-ayon, nagbibigay-pahintulot at pinapayagan ang Etiqa General Insurance Berhad (mula rito ay tinatawag na "Etiqa General Insurance") na iproseso ang aking/aming personal na data (kabilang ang sensitibong personal na data) ("Personal na Data") na may intensyon ng pagpasok sa isang kontrata ng Seguro, alinsunod sa mga probisyon ng Personal Data Protection Act 2010.
							</p>
							<p>
								Ako, nauunawaan at sumasang-ayon na ang anumang Personal na Data na nakolekta o hawak ng Etiqa General Insurance (maging nakapaloob sa aplikasyong ito o hindi) ay maaaring hawakan, gamitin, iproseso at ibunyag ng Etiqa General Insurance sa mga indibidwal at/o organisasyon na nauugnay at nauugnay sa Etiqa General Insurance o anumang napiling ikatlong partido (sa loob o labas ng Pilipinas, kabilang ang mga medikal na institusyon, mga reinsurer, mga adjuster/imbestigador ng paghahabol, mga abogado, mga asosasyon ng industriya, mga regulator, mga katawan ng batas at mga awtoridad ng pamahalaan) para sa layunin ng pagproseso ng aplikasyong ito at pagbibigay ng kasunod na serbisyo na kaugnay nito at upang makipag-ugnayan sa akin/amin para sa naturang mga layunin.
							</p>
							<p>
								Naiintindihan ko na Ako/Kami ay may karapatang makakuha ng access at humiling ng pagwawasto ng anumang Personal na Data na hawak ng Etiqa General Insurance tungkol sa akin/amin. Ang naturang kahilingan ay maaaring gawin sa pamamagitan ng pagkumpleto ng Access Request Form na makukuha sa website ng Etiqa, lahat ng sangay ng Etiqa Insurance o makipag-ugnayan sa Etiqa General Insurance sa pamamagitan ng email sa PDPA@etiqa.com.my. Alinsunod sa mga probisyon ng Personal Data Protection Act 2010, maaari akong makipag-ugnayan sa Customer Service Centre sa Etiqa Online 1 300 13 8888 para sa mga detalye ng aking/aming Personal na Data. Ang naturang impormasyon ay ibibigay lamang pagkatapos ng pag-verify.
							</p>
							<p>
								Sumasang-ayon ako, nagbibigay-pahintulot at pinapayagan ang Etiqa General Insurance na ibahagi ang aking/aming Personal na Data sa Maybank Group, mga ahente ng Etiqa Insurance o mga estratehikong kasosyo at iba pang ikatlong partido ("iba pang mga entity") na naaaangkop sa Etiqa General Insurance at Ako/Kami ay maaaring makatanggap ng marketing communication mula sa Etiqa General Insurance o mula sa mga iba pang entity na ito tungkol sa mga produkto at serbisyong maaaring interesado sa akin/amin.
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
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:80px;margin-top:-42px">Oo</p>

													</td>
												</div>
												<div style="display:flex;">
													<td style="width: 50%;padding-left:30px;padding-bottom:35px;">

														<img height="70px">
															<xsl:attribute name="src">
																<xsl:value-of select="root/ImageChecked" />
															</xsl:attribute>
														</img>
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:90px;margin-top:-42px">Hindi</p>

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
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:80px;margin-top:-42px">Oo</p>
													</td>
												</div>
												<div style="display:flex;">
													<td style="width: 50%;padding-left:40px;padding-bottom:35px;">
														<img height="66px">
															<xsl:attribute name="src">
																<xsl:value-of select="root/ImageUnchecked" />
															</xsl:attribute>
														</img>
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:70px;margin-top:-42px">Hindi</p>
													</td>
												</div>
											</xsl:when>
										</xsl:choose>
									</tr>
								</table>
							</div>

							<p>
								Tandaan: Kung hindi na ninyo nais na tumanggap ng marketing communications, mangyaring abisuhan ang Etiqa General Insurance na bawiin ang inyong pahintulot at titigil ang Etiqa General Insurance sa pagproseso at pagbabahagi ng inyong Personal na Data sa mga iba pang entity na ito para sa layunin ng pagpapadala sa inyo ng marketing communications. Para sa pag-iwas sa pag-aalinlangan, ang pagbawi ay hindi kasama ang pagproseso ng inyong mandatory na Personal na Data.
							</p>
							<p style="font-size:18px; padding-top: 50px; padding-bottom: 30px;">
								ITO AY ISANG DOKUMENTONG NABUO NG COMPUTER AT HINDI NANGANGAILANGAN NG PIRMA
							</p>
						</div>

					</div>
				</div>
				<table>
					<tr style="height:90px"></tr>
				</table>
				<div style="margin-top:80px;bottom: 0; margin-left:5px; margin-right:5px;">
					<img
						  height="70px;"
					width="100%;"
            >
						<xsl:attribute name="src">
							<xsl:value-of select="root/ImageEgibEnFooter"/>
						</xsl:attribute>
					</img>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
