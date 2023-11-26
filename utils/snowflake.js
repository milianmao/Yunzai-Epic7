class Snowflake {
    constructor(workerId, datacenterId) {
        // 根据需要调整位数
        this.workerIdBits = 5;
        this.datacenterIdBits = 5;
        this.sequenceBits = 12;

        this.maxWorkerId = -1 ^ (-1 << this.workerIdBits);
        this.maxDatacenterId = -1 ^ (-1 << this.datacenterIdBits);

        this.workerId = workerId || 0;
        this.datacenterId = datacenterId || 0;
        this.sequence = 0;

        this.timestampLeftShift = this.sequenceBits + this.workerIdBits + this.datacenterIdBits;
        this.workerIdShift = this.sequenceBits + this.datacenterIdBits;
        this.datacenterIdShift = this.sequenceBits;

        this.sequenceMask = -1 ^ (-1 << this.sequenceBits);

        this.lastTimestamp = -1;
    }

    nextId() {
        let timestamp = this.timeGen();

        if (timestamp < this.lastTimestamp) {
            throw new Error('Clock moved backwards. Refusing to generate id');
        }

        if (this.lastTimestamp === timestamp) {
            this.sequence = (this.sequence + 1) & this.sequenceMask;
            if (this.sequence === 0) {
                timestamp = this.tilNextMillis(this.lastTimestamp);
            }
        } else {
            this.sequence = 0;
        }

        this.lastTimestamp = timestamp;

        return (
            (BigInt(timestamp) << BigInt(this.timestampLeftShift)) |
            (BigInt(this.datacenterId) << BigInt(this.datacenterIdShift)) |
            (BigInt(this.workerId) << BigInt(this.workerIdShift)) |
            BigInt(this.sequence)
        ).toString();
    }

    tilNextMillis(lastTimestamp) {
        let timestamp = this.timeGen();
        while (timestamp <= lastTimestamp) {
            timestamp = this.timeGen();
        }
        return timestamp;
    }

    timeGen() {
        return BigInt(Date.now());
    }
}

export default new Snowflake(1, 1);
