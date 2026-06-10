<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<html>

			<head>
				<title></title>
				<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
				<style type="text/css">
					a {
					text-decoration: none
					}

					.ft11 {
					font-size: 16px;
					font-family: Helvetica;
					color: #000000;
					}

					.ft12 {
					font-size: 10px;
					font-family: Helvetica;
					color: #000000;
					}

					.ft13 {
					font-size: 16px;
					line-height: 20px;
					font-family: Helvetica;
					color: #000000;
					}

					.ft14 {
					font-size: 10px;
					line-height: 13px;
					font-family: Helvetica;
					color: #000000;
					}

					.ft15 {
					font-size: 13px;
					line-height: 17px;
					font-family: Helvetica;
					color: #000000;
					}
				</style>
			</head>

			<body text="#000000" link="#000000" alink="#000000" vlink="#000000">
				<table id="JR_PAGE_ANCHOR_0_1" role="none" class="jrPage" cellpadding="0" cellspacing="0" border="0" style="empty-cells: show; width: 980px; border-collapse: collapse; background-color: white;margin-left:15px;">
					<style type="text/css">
						#JR_PAGE_ANCHOR_0_1 th {
						font-weight: normal;
						}

						#JR_PAGE_ANCHOR_0_1 ul {
						list-style-type: disc;
						padding-inline-start: 40px;
						margin: 0px;
						}

						#JR_PAGE_ANCHOR_0_1 ol {
						list-style-type: decimal;
						padding-inline-start: 40px;
						margin: 0px;
						}
					</style>
					<tr role="none" valign="top" style="height:0">
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr rowspan="2" style="height:35px;" valign="top">
						<td colspan="1" rowspan="3" style="padding-top:5px;">
							<p style="position:absolute;top:55px;left:23px;white-space:nowrap" class="ft14">
								<xsl:value-of select="root/P_CompanyAddress"/><br/>T <xsl:value-of select="root/P_ContactPhone"/> E <xsl:value-of select="root/P_ContactEmail"/> <xsl:value-of select="root/P_WebsiteUrl"/>
							</p>
							<p style="position:absolute;top:95px;left:23px;white-space:nowrap" class="ft12">Customer Service :- <xsl:value-of select="root/P_ContactPhone"/></p>
							<p style="position:absolute;top:30px;left:23px;white-space:nowrap" class="ft10"><xsl:value-of select="root/P_CompanyName"/></p>
						</td>

						<td colspan="3" style="text-indent: 0px; text-align: left;padding-top:25px; padding-left:550px">
							<table width="200%">
								<tr>
									<td width="100%">
										<span style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500; margin-left:-3px;"> </span>
									</td>
									<td width="5%">
										<span style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500; "></span>
									</td>
									<td width="50%">
										<span style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500;">
										</span>
									</td>
								</tr>
							</table>
						</td>
						<td colspan="3" rowspan="3" style="text-indent: 0px; text-align: left;padding-top:10px; padding-left:150px">
							<table width="100%">
								<tr>
									<td width="100%">
										<span style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500; margin-left:3px;">
											<img width='150' height='100'>
												<xsl:attribute name="src">
													<xsl:value-of select="root/ImageEgibEnHeader"/>
												</xsl:attribute>
											</img>
										</span>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr style="height:30px;" valign="top">
						<td colspan="6" style="text-indent: 0px; text-align: left;padding-left:550px">
							<table width="100%">
								<tr>
									<td width="60%">
										<span style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500; margin-left:-3px;">TAX INVOICE</span>
									</td>
									<td width="5%">
										<span style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500; "> </span>
									</td>
									<td width="50%">
										<span style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500;">
										</span>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr style="height:30px;" valign="top">
						<td colspan="1" style="text-indent: 0px; text-align: left; padding-left: 390px;">
							<table width="200%">
								<tr>
									<td width="100%">
										<span style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500; margin-left:-3px;">
											Service Tax Reg No: <xsl:value-of select="root/P_taxRegNo"/>
										</span>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr style="height:11px;">
						<td colspan="10"></td>

					</tr>
					<tr style="height:30px; border-top: 2px solid black; border-left: 2px solid black; border-right: 2px solid black;">
						<td colspan="4" width="65%"></td>
						<td colspan="3" style="text-indent: 0px; text-align: left;">
							<span style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500; "></span>
						</td>
						<td colspan="2" style="border-right:2px solid black"></td>
					</tr>
					<tr style="height:0px; border-left: 2px solid black; border-right: 2px solid black;">
						<td colspan="4" width="65%"></td>
						<td colspan="3" style="text-indent: 0px; text-align: left;">
							<span style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500; ">CUSTOMER COPY</span>
						</td>
						<td colspan="2" style="border-right:2px solid black"></td>
					</tr>
					<tr style="height:80px;">
						<td colspan="4" style="border-left: 2px solid black;"></td>
						<td colspan="5" style="text-indent: 0px; text-align: left;border-right: 2px solid black;">
							<table width="100%">
								<tr>
									<td width="45%">
										<span style="font-family: Arial; color: #000000; font-size: 12px; margin-left:-3px;">
											Tax Invoice No
										</span>
									</td>
									<td width="5%">
										<span style="font-family: Arial; color: #000000; font-size: 12px; "></span>
									</td>
									<td width="50%">
										<span style="font-family: Arial; color: #000000; font-size: 12px; ">
										</span>
									</td>
								</tr>
								<tr>
									<td width="45%">
										<span style="font-family: Arial; color: #000000; font-size: 12px; margin-left:-3px;">
											<xsl:value-of select="root/P_TaxInvoiceNo"/>
										</span>
									</td>
									<td width="5%">
										<span style="font-family: Arial; color: #000000; font-size: 12px; "></span>
									</td>
									<td width="50%">
										<span style="font-family: Arial; color: #000000; font-size: 12px; ">
										</span>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr style="height:20px; border-left: 2px solid black; border-right: 2px solid black;">
						<td colspan="4" width="65%"></td>
						<td colspan="3" style="text-indent: 0px; text-align: left;">
							<span style="font-family: Arial; color: #000000; font-size: 12px; ">
							</span>
						</td>
						<td colspan="2" style="border-right:2px solid black"></td>
					</tr>
					<tr valign="top" style="height:30px; border-left: 2px solid black;">
						<td colspan="9" style="border-right: 2px solid black;">
							<div style="width:100%;">
								<table width="100%" border="0">
									<tr>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
									</tr>
									<tr style="height:30px;" valign="top">
										<td width="25%" style="padding-left:10px;">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">Date</span>
										</td>
										<td width="30%">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">
												Payment Mode

											</span>
										</td>
										<td width="5%"></td>
										<td width="25%">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">Premium</span>
										</td>
										<td width="8%">
											<span style="font-family: Arial; color: #000000; font-size: 12px; "> <xsl:value-of select="root/P_Currency"/>:</span>
										</td>
										<td width="5%" style="text-align:right;">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">
												<xsl:value-of select="root/P_GrossPremium"/>
											</span>
										</td>
										<td width="2%"></td>
									</tr>
									<tr style="height:30px;" valign="top">
										<td width="25%" style="padding-left:10px;">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">
												<xsl:value-of select="root/P_Date"/>
											</span>
										</td>
										<td width="30%">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">
												<xsl:value-of select="root/P_Paymode"/>
											</span>
										</td>
										<td width="5%"></td>
										<td width="25%">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">
												<xsl:choose>
													<xsl:when test="root/P_IsLppsa = 'true'">
														<xsl:value-of select="root/P_taxType"/> ( <xsl:value-of select="root/P_TaxPercentage"/>% )
													</xsl:when>
													<xsl:otherwise>
														Discount ( <xsl:value-of select="root/P_DiscountRate"/>% )
													</xsl:otherwise>
												</xsl:choose>
											</span>
										</td>
										<td width="8%">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">
												<xsl:choose>
													<xsl:when test="root/P_IsLppsa = 'true'">
														<xsl:value-of select="root/P_Currency"/>:
													</xsl:when>
													<xsl:otherwise>
														<xsl:value-of select="root/P_Currency"/>:(-)
													</xsl:otherwise>
												</xsl:choose>
											</span>
										</td>
										<td width="5%" style="text-align:right;">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">
												<xsl:choose>
													<xsl:when test="root/P_IsLppsa = 'true'">
														<xsl:value-of select="root/P_SST"/>
													</xsl:when>
													<xsl:otherwise>
														<xsl:value-of select="root/P_Discount"/>
													</xsl:otherwise>
												</xsl:choose>
											</span>
										</td>
										<td width="2%"></td>
									</tr>
									<tr style="height:30px;" valign="top">
										<td width="25%" style="padding-left:10px;">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">Name</span>
										</td>
										<td width="30%">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">
												<xsl:value-of select="root/P_Name"/>
											</span>
										</td>
										<td width="5%"></td>
										<td width="25%">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">
												<xsl:choose>
													<xsl:when test="root/P_IsLppsa = 'true'">
														Stamp Duty
													</xsl:when>
													<xsl:otherwise>
														<xsl:value-of select="root/P_taxType"/> ( <xsl:value-of select="root/P_TaxPercentage"/>% )
													</xsl:otherwise>
												</xsl:choose>
											</span>
										</td>
										<td width="8%">
											<span style="font-family: Arial; color: #000000; font-size: 12px; "> <xsl:value-of select="root/P_Currency"/>:</span>
										</td>
										<td width="5%" style="text-align:right;">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">
												<xsl:choose>
													<xsl:when test="root/P_IsLppsa = 'true'">
														<xsl:value-of select="root/P_StampDuty"/>
													</xsl:when>
													<xsl:otherwise>
														<xsl:value-of select="root/P_SST"/>
													</xsl:otherwise>
												</xsl:choose>
											</span>
										</td>
										<td width="2%"></td>
									</tr>
									<tr style="height:30px;" valign="top">
										<td width="25%" style="padding-left:10px;">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">Address</span>
										</td>
										<td width="30%" rowspan="3">
											<table>
												<tr>
													<td>
														<span style="font-family: Arial; color: #000000; font-size: 12px;margin-left:-3px;"> </span>
														<span style="font-family: Arial; color: #000000; font-size: 12px;">
															<xsl:value-of select="root/P_Address1"/>
														</span>
													</td>
												</tr>
												<tr>
													<td>
														<span style="font-family: Arial; color: #000000; font-size: 12px;margin-left:-3px;">
															<xsl:value-of select="root/P_Address2"/>
														</span>
													</td>
												</tr>
												<tr>
													<td>
														<span style="font-family: Arial; color: #000000; font-size: 12px;margin-left:-3px;">
															<xsl:value-of select="root/P_Address3"/>
														</span>
													</td>
												</tr>
												<tr>
													<td>
														<span style="font-family: Arial; color: #000000; font-size: 12px;margin-left:-3px;">
															<xsl:value-of select="root/P_Address4"/>
														</span>
													</td>
												</tr>
												<xsl:if test="root/P_MailDistrict != ''">
													<tr><td><span style="font-family: Arial; color: #000000; font-size: 12px;margin-left:-3px;"><xsl:value-of select="root/P_MailDistrict"/></span></td></tr>
												</xsl:if>
												<xsl:if test="root/P_MailVillage != ''">
													<tr><td><span style="font-family: Arial; color: #000000; font-size: 12px;margin-left:-3px;"><xsl:value-of select="root/P_MailVillage"/></span></td></tr>
												</xsl:if>
											</table>
										</td>
										<td width="5%"></td>
										<td width="25%">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">
												<xsl:choose>
													<xsl:when test="root/P_IsLppsa = 'true'">
														Amount Subsidized
													</xsl:when>
													<xsl:otherwise>
														Stamp Duty
													</xsl:otherwise>
												</xsl:choose>
											</span>
										</td>
										<td width="8%">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">
												<xsl:choose>
													<xsl:when test="root/P_IsLppsa = 'true'">
														<xsl:value-of select="root/P_Currency"/>:(-)
													</xsl:when>
													<xsl:otherwise>
														<xsl:value-of select="root/P_Currency"/>:
													</xsl:otherwise>
												</xsl:choose>
											</span>
										</td>
										<td width="5%" style="text-align:right;">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">
												<xsl:choose>
													<xsl:when test="root/P_IsLppsa = 'true'">
														<xsl:value-of select="root/P_SubsidizedAmount"/>
													</xsl:when>
													<xsl:otherwise>
														<xsl:value-of select="root/P_StampDuty"/>
													</xsl:otherwise>
												</xsl:choose>
											</span>
										</td>
										<td width="2%"></td>
									</tr>
									<tr style="height:30px;" valign="top">
											<td width="25%"></td>
											<td width="5%"></td>
											<td width="25%">
												<span style="font-family: Arial; color: #000000; font-size: 12px; ">Total</span>
											</td>
											<td width="8%">
												<span style="font-family: Arial; color: #000000; font-size: 12px; "> <xsl:value-of select="root/P_Currency"/>:</span>
											</td>
											<td width="5%" style="text-align:right;">
												<span style="font-family: Arial; color: #000000; font-size: 12px; ">
													<xsl:value-of select="root/P_Total"/>
												</span>
											</td>
											<td width="2%"></td>
									</tr>
									<tr style="height:30px;" valign="top">
										<td colspan="7"></td>
									</tr>
									<tr style="height:30px;" valign="top">
										<td width="25%" style="padding-left:10px;">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">Product Name</span>
										</td>
										<td colspan="6">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">
												<!--<xsl:value-of select="root/P_ProductName"/>-->
												<xsl:value-of select="root/P_ProductTypeName"/>
											</span>
										</td>
									</tr>
									<tr style="height:30px;" valign="top">
										<td width="25%" style="padding-left:10px;">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">Account No.</span>
										</td>
										<td colspan="6">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">
												<xsl:value-of select="root/P_AgentCode"/>
											</span>
										</td>
									</tr>
									<tr style="height:30px;" valign="top">
										<td width="25%" style="padding-left:10px;">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">Policy No.</span>
										</td>
										<td colspan="6">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">
												<xsl:value-of select="root/P_policyNo"/>
											</span>
										</td>
									</tr>
									<tr style="height:30px;" valign="top">
										<td width="25%" style="padding-left:10px;">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">Being Payment</span>
										</td>
										<td colspan="6">
											<span style="font-family: Arial; color: #000000; font-size: 12px; ">
												<xsl:value-of select="root/P_BeingPayment"/>
											</span>
										</td>
									</tr>
								</table>
							</div>
						</td>
					</tr>
					<tr style="height:30px; border-top: 2px solid black;">
						<td colspan="9"></td>
					</tr>
					<tr style="height:15px;">
						<td colspan="6">
							<span style="font-family: 'DejaVu Sans', Arial, Helvetica, sans-serif; color: #000000; font-size: 10px;">
								This is a computer generated receipt and no signature is required
							</span>
						</td>
						<td style="text-align:right; padding-right:60px;">
							<img width='170' height='65'>
								<xsl:attribute name="src">
									<xsl:value-of select="root/FooterImage" />
								</xsl:attribute>
							</img>
						</td>
					</tr>
				</table>
			</body>

		</html>
	</xsl:template>
</xsl:stylesheet>