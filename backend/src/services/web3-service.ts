import { ethers } from "ethers"
import { config } from "../config"
import type { Web3Network } from "../types"

export class Web3Service {
  private ethereumProvider: ethers.JsonRpcProvider
  private polygonProvider: ethers.JsonRpcProvider

  constructor(ethereumRpc?: string, polygonRpc?: string) {
    this.ethereumProvider = new ethers.JsonRpcProvider(ethereumRpc || config.web3.ethereumRpc)
    this.polygonProvider = new ethers.JsonRpcProvider(polygonRpc || config.web3.polygonRpc)
  }

  async getEthereumMetrics(): Promise<Web3Network> {
    try {
      const [blockNumber, feeData, block] = await Promise.all([
        this.ethereumProvider.getBlockNumber(),
        this.ethereumProvider.getFeeData(),
        this.ethereumProvider.getBlock("latest"),
      ])

      const previousBlock = await this.ethereumProvider.getBlock(blockNumber - 1)
      const blockTime = block && previousBlock ? block.timestamp - previousBlock.timestamp : 12

      const gasPrice = feeData.gasPrice ? Number(ethers.formatUnits(feeData.gasPrice, "gwei")) : 0
      const maxFeePerGas = feeData.maxFeePerGas ? Number(ethers.formatUnits(feeData.maxFeePerGas, "gwei")) : 0

      return {
        id: "ethereum",
        name: "Ethereum",
        chainId: 1,
        status: "healthy",
        blockNumber,
        blockTime,
        tps: block ? block.transactions.length / blockTime : 0,
        gasPrice: {
          slow: gasPrice * 0.8,
          average: gasPrice,
          fast: maxFeePerGas || gasPrice * 1.2,
        },
        gasTrend: "stable",
      }
    } catch (error) {
      console.error("Error fetching Ethereum metrics:", error)
      return {
        id: "ethereum",
        name: "Ethereum",
        chainId: 1,
        status: "offline",
        blockNumber: 0,
        blockTime: 0,
        tps: 0,
        gasPrice: { slow: 0, average: 0, fast: 0 },
        gasTrend: "stable",
      }
    }
  }

  async getPolygonMetrics(): Promise<Web3Network> {
    try {
      const [blockNumber, feeData, block] = await Promise.all([
        this.polygonProvider.getBlockNumber(),
        this.polygonProvider.getFeeData(),
        this.polygonProvider.getBlock("latest"),
      ])

      const previousBlock = await this.polygonProvider.getBlock(blockNumber - 1)
      const blockTime = block && previousBlock ? block.timestamp - previousBlock.timestamp : 2

      const gasPrice = feeData.gasPrice ? Number(ethers.formatUnits(feeData.gasPrice, "gwei")) : 0
      const maxFeePerGas = feeData.maxFeePerGas ? Number(ethers.formatUnits(feeData.maxFeePerGas, "gwei")) : 0

      return {
        id: "polygon",
        name: "Polygon",
        chainId: 137,
        status: "healthy",
        blockNumber,
        blockTime,
        tps: block ? block.transactions.length / blockTime : 0,
        gasPrice: {
          slow: gasPrice * 0.8,
          average: gasPrice,
          fast: maxFeePerGas || gasPrice * 1.2,
        },
        gasTrend: "stable",
      }
    } catch (error) {
      console.error("Error fetching Polygon metrics:", error)
      return {
        id: "polygon",
        name: "Polygon",
        chainId: 137,
        status: "offline",
        blockNumber: 0,
        blockTime: 0,
        tps: 0,
        gasPrice: { slow: 0, average: 0, fast: 0 },
        gasTrend: "stable",
      }
    }
  }

  async getAllNetworks(): Promise<Web3Network[]> {
    const [ethereum, polygon] = await Promise.all([this.getEthereumMetrics(), this.getPolygonMetrics()])

    return [ethereum, polygon]
  }
}
