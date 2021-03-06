import { Repository } from 'typeorm'
import { User } from '../entities/User'
import { EncryptionService } from './EncryptionService'
import { HttpService } from './HttpService'

import { classToPlain } from 'class-transformer'
import { Service, Inject } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { validate } from 'class-validator'
import { providers } from '../constants/SocialProviders'

@Service()
export class AuthService {
    @InjectRepository(User)
    userRepository: Repository<User>
    @Inject()
    encryptionService: EncryptionService
    @Inject()
    httpService: HttpService

    login = async (password: string, email: string) => {
        const errorResponse = {
            error: 'invalid credentials',
        }
        const currentUser = await this.userRepository.findOne({ email })
        if(!currentUser) {
            throw errorResponse
        }
        const isValidPassword = this.encryptionService.compare(
            password,
            currentUser.password
        )
     
        if (isValidPassword) {
            return {
                token: this.encryptionService.sign(classToPlain(currentUser)),
            }
        } else {
            throw errorResponse
        }
    }

    resetPassword = async (
        password: string,
        email: string,
        newPassword: string
    ) => {
        const currentUser = await this.userRepository.findOne({ email })

        const isValidPassword = this.encryptionService.compare(
            password,
            currentUser.password
        )
        const errorResponse = {
            error: 'invalid credentials',
        }
        if (currentUser && isValidPassword) {
            currentUser.password = this.encryptionService.encrypt(newPassword)

            const userResponse = await this.userRepository.save(currentUser)
            return {
                token: this.encryptionService.sign(classToPlain(userResponse)),
            }
        } else {
            throw errorResponse
        }
    }

    register = async (user: User, password) => {
        const exitingUser = await this.userRepository.findOne({
            email: user.email,
        })
        if (exitingUser) {
            throw [{ error: 'email aleardy exists' }]
        }
        const hash = this.encryptionService.encrypt(password)
        user.password = hash
        const errors = await validate(user)
        if (errors.length > 0) {
            const err = errors.map(error => error.constraints)
            throw err
        }

        const userResponse = await this.userRepository.save(user)
        return {
            token: this.encryptionService.sign(classToPlain(userResponse)),
        }
    }

    registerWithProvider = async (provider, authToken) => {
        const profile = await this.validateWithProvider(
            provider,
            authToken
        )
        const exitingUser = await this.userRepository.findOne({
            email: profile.email,
        })
        if (exitingUser) {
            return {
                token: this.encryptionService.sign(classToPlain(exitingUser)),
            }
        }
        const user = new User()
        user.email = profile.email
        user.firstName = profile.first_name
        user.lastName = profile.last_name

        const userResponse = await this.userRepository.save(user)
        return {
            token: this.encryptionService.sign(classToPlain(userResponse)),
        }
    }

    validateWithProvider = async (network, socialToken) => {
        const url = providers[network].url;
        const fields = providers[network].fields;
        const resp = await this.httpService.get(url,{
            params: {
                access_token: socialToken,
                fields
            }
        })

        return resp.data
    }
}
